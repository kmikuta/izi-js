require "jsduck/tag/tag"

# Do not print @sanity in documentation

class SanityTag < JsDuck::Tag::Tag
  def initialize
    @tagname = :sanity
    @pattern = "sanity"
  end

  def parse_doc(scanner, position)
    text = scanner.match(/.*$/)
    return { :tagname => :sanity, :text => "" }
  end

  def to_html(arg)
    ""
  end
end