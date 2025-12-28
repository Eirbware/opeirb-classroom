from pathlib import Path

base_slug = "api"
base_stow_dir = Path(f"./{base_slug}")
nb_new_dirs = 56

for i in range(1, nb_new_dirs+1):
    new_stow_dir = Path(f"./{base_slug}-{i}")
    new_dir = base_stow_dir.copy(new_stow_dir)
    dir_to_rename = new_dir / "courses" / base_slug
    new_name = new_dir / "courses" / f"{base_slug}-{i}"
    dir_to_rename.rename(new_name)
