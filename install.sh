#!/bin/bash
# Optional. The menu finds bin/ on its own; this also puts the scripts on PATH.
set -euo pipefail
dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
mkdir -p "${HOME}/.local/bin"
for name in plutos-flatpak-install plutos-flatpak-remove; do
  ln -sfn "${dir}/bin/${name}" "${HOME}/.local/bin/${name}"
done
echo "Pluto's Menu scripts linked into ${HOME}/.local/bin"
