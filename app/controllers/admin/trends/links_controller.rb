# frozen_string_literal: true

class Admin::Trends::LinksController < Admin::BaseController
  def index
    @preview_cards = Trends.links.get(false, 20)
  end
end
