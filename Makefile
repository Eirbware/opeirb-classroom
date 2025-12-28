test-content-dir := content/test-content
docs-content-dir := src/content/docs

test-content-slugs := $(notdir $(patsubst %/,%, $(wildcard $(test-content-dir)/*/)))


.PHONY: enable-test-content disable-test-content echo

echo:
	@echo $(test-content-slugs)

enable-test-content:
	stow --dir $(test-content-dir) --target $(docs-content-dir) $(test-content-slugs)

disable-test-content:
	stow -D --dir $(test-content-dir) --target $(docs-content-dir) $(test-content-slugs)
