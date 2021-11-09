# frozen_string_literal: true

class Trends::Links < Trends::Base
  PREFIX = 'trending_links'

  # Minimum amount of uses by unique accounts to begin calculating the score
  THRESHOLD = 3

  # Minimum rank (lower = better) before requesting a review
  REVIEW_THRESHOLD = 10

  def register(status, at_time = Time.now.utc)
    original_status = status.reblog? ? status.reblog : status

    return unless original_status.public_visibility? && status.public_visibility? && !original_status.account.silenced? && !status.account.silenced?

    original_status.preview_cards.each do |preview_card|
      add(preview_card, status.account_id, at_time) if preview_card.appropriate_for_trends?
    end
  end

  def add(preview_card, account_id, at_time = Time.now.utc)
    preview_card.history.add(account_id, at_time)
    record_used_id(preview_card.id, at_time)
  end

  def get(allowed, limit)
    preview_card_ids = currently_trending_ids(allowed, limit)
    preview_cards = PreviewCard.where(id: preview_card_ids).index_by(&:id)
    preview_card_ids.map { |id| preview_cards[id] }.compact
  end

  def calculate(at_time = Time.now.utc)
    preview_cards = PreviewCard.where(id: (recently_used_ids(at_time) + currently_trending_ids(false, -1)).uniq)

    calculate_scores(preview_cards, at_time)
    request_review_for_trending_items(preview_cards)
    trim_older_items
  end

  protected

  def key_prefix
    PREFIX
  end

  private

  def calculate_scores(preview_cards, at_time)
    preview_cards.each do |preview_card|
      expected  = preview_card.history.get(at_time - 1.day).accounts.to_f
      expected  = 1.0 if expected.zero?
      observed  = preview_card.history.get(at_time).accounts.to_f

      score = begin
        if expected > observed || observed < THRESHOLD
          0
        else
          ((observed - expected)**2) / expected
        end
      end

      if score.zero?
        redis.zrem("#{PREFIX}:all", preview_card.id)
        redis.zrem("#{PREFIX}:allowed", preview_card.id)
      else
        redis.zadd("#{PREFIX}:all", score, preview_card.id)
        redis.zadd("#{PREFIX}:allowed", score, preview_card.id) if preview_card.provider&.trendable?
      end
    end
  end

  def request_review_for_trending_items(preview_cards)
    preview_cards_requiring_review = preview_cards.filter_map do |preview_card|
      next unless would_be_trending?(preview_card.id) && !preview_card.provider&.trendable? && preview_card.provider&.requires_review_notification?

      if preview_card.provider.nil?
        preview_card.provider = PreviewCardProvider.create(domain: preview_card.domain, requested_review_at: Time.now.utc)
      else
        preview_card.provider.touch(:reviewed_requested_at)
      end

      preview_card
    end

    return if preview_cards_requiring_review.empty?

    User.staff.includes(:account).find_each do |user|
      AdminMailer.new_trending_links(user.account, preview_cards_requiring_review).deliver_later! if user.allows_trending_tag_emails?
    end
  end

  def would_be_trending?(id)
    score_at_threshold = redis.zrevrange("#{key_prefix}:allowed", REVIEW_THRESHOLD, REVIEW_THRESHOLD, with_scores: true).first&.last || Float::INFINITY
    (redis.zscore("#{key_prefix}:all", id) || 0) > score_at_threshold
  end
end
