# frozen_string_literal: true

module Trends
  def self.table_name_prefix
    'trends_'
  end

  def self.links
    @links ||= Trends::Links.new
  end

  def self.tags
    @tags ||= Trends::Tags.new
  end

  def self.calculate
    [links, tags].each do |trends|
      trends.calculate
    rescue
      next
    end
  end
end
