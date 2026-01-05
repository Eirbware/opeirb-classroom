# -----------------------------
# Variables
# -----------------------------

mock_content_dir := "content/mock"
template_content_dir := "content/template"
actual_content_dir := "content/actual"

docs_content_dir := "src/content/docs"

# -----------------------------
# Default / help
# -----------------------------

default:
    @just --list

# -----------------------------
# Enable/disable all the content (actual or mock)
# -----------------------------

toggle-full-content MOCK ENABLE:
  stow {{ if ENABLE == "true" {""} else {"-D"} }} \
    --dir {{ if MOCK == "true" {mock_content_dir} else {actual_content_dir} }} \
    --target {{docs_content_dir}} \
    $(ls -d {{ if MOCK == "true" {mock_content_dir} else {actual_content_dir} }}/*/ 2>/dev/null | xargs -n1 basename)

# -----------------------------
# Per-project content (requires FTX_CWD)
# -----------------------------

toggle-content FTX_CWD ENABLE:
  stow {{ if ENABLE == "true" {""} else {"-D"} }} \
    --dir {{actual_content_dir}} --target {{docs_content_dir}} {{FTX_CWD}}

[confirm("This will copy all the files inside the given directory. Sure?")]
init-template FTX_CWD:
  cp -r {{template_content_dir}} {{actual_content_dir}}/{{FTX_CWD}}
