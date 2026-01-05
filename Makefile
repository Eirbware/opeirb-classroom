mock-content-dir := content/mock
docs-content-dir := src/content/docs

mock-content-slugs := $(notdir $(patsubst %/,%, $(wildcard $(mock-content-dir)/*/)))


.PHONY: enable-mock-content disable-mock-content echo

echo:
	@echo $(mock-content-slugs)

enable-mock-content:
	stow --dir $(mock-content-dir) --target $(docs-content-dir) $(mock-content-slugs)

disable-mock-content:
	stow -D --dir $(mock-content-dir) --target $(docs-content-dir) $(mock-content-slugs)
