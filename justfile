CONDA_ENV_PREFIX := "./.opeirbclass-env"
CONDA_RUN := "conda run -p " + CONDA_ENV_PREFIX + " --no-capture-output"

default:
  @just --list
 
[group("install")]
install:
  npm install

# perform a complete, isolated installation
[group("install")]
[group("conda")]
conda-full-install:
  conda env create --prefix {{CONDA_ENV_PREFIX}} --file environment.yaml && \
    {{CONDA_RUN}} just install

# delete the built files
[group("clean")]
clean:
  rm -rf public static/svelte

# delete the build and library files
[group("clean")]
[confirm]
clean-deps: clean
  rm -rf node_modules

# delete all the build, library and environment files
[group("conda")]
[group("clean")]
conda-full-clean: clean-deps
  conda remove --prefix {{CONDA_ENV_PREFIX}} --all

[group("dev")]
dev-components:
  npm run svelte-dev

[group("dev")]
dev-content-with-drafts:
  npm run hugo-dev

[group("dev")]
dev-content-without-drafts:
  npm run hugo

[group("dev")]
dev-full-with-drafts:
  npm run dev

[group("dev")]
dev-full-without-drafts:
  npm run start

[group("prod")]
[group("dev")]
build-components:
  npm run vbuild

# build the full website from the already built components
[group("prod")]
build-content:
  hugo

# build the front components and after the full website
[group("prod")]
build-full:
  npm run build
