require "jsduck/tag/tag"

# Do not print @nosanity in documentation

class NoSanityTag2 < JsDuck::Tag::Tag
  def initialize
    @pattern = "nosanity"
  end

  def to_html(arg)
    ""
  end
end