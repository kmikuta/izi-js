require "jsduck/tag/tag"

# Do not print @nosanity in documentation

class NoSanityTag < JsDuck::Tag::Tag
  def initialize
    @pattern = "noSanity"
  end

  def to_html(arg)
    ""
  end
end