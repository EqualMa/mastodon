# frozen_string_literal: true

class Trends::Base
  include Redisable

  def register(_status)
    raise NotImplementedError
  end

  def add(*)
    raise NotImplementedError
  end

  def calculate(*)
    raise NotImplementedError
  end

  def get(*)
    raise NotImplementedError
  end

  protected

  def key_prefix
    raise NotImplementedError
  end

  def currently_trending_ids(allowed, limit)
    redis.zrevrange(allowed ? "#{key_prefix}:allowed" : "#{key_prefix}:all", 0, limit).map(&:to_i)
  end

  def recently_used_ids(at_time = Time.now.utc)
    redis.smembers(used_key(at_time)).map(&:to_i)
  end

  def record_used_id(id, at_time = Time.now.utc)
    redis.sadd(used_key(at_time), id)
    redis.expire(used_key(at_time), 1.day.seconds)
  end

  def trim_older_items
    redis.zremrangebyscore("#{key_prefix}:all", '(0.3', '-inf')
    redis.zremrangebyscore("#{key_prefix}:allowed", '(0.3', '-inf')
  end

  private

  def used_key(at_time)
    "#{key_prefix}:used:#{at_time.beginning_of_day.to_i}"
  end
end
