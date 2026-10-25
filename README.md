# Pluto's Menu

An Omarchy 4 menu that puts back the Omarchy 3 pieces that Quattro dropped, and adds a Flatpak installer beside Arch and the AUR.

It replaces the built-in menu while it is enabled (`omarchy.clonedFrom` is `omarchy.menu`). Disable or remove it and the stock menu comes back. Super+Space, `omarchy menu summon`, and the menu bar button all land here.

The menu sources started from Omarchy's quattro `shell/plugins/menu` (MIT, Copyright David Heinemeier Hansson). Pluto's changes are marked `PLUTO` in `Menu.qml`. Behavior that is not the stock menu lives in `Pluto.js`.

## Install

```bash
omarchy plugin add https://github.com/CharmedPlutonia/plutos-menu.git --enable
```

Flatpak is a row under **Install** and **Remove**. It uses the same fuzzy finder as Arch and the AUR. The scripts live in this repo, and the menu finds them. You can also link them onto your `PATH`:

```bash
~/.config/omarchy/plugins/party.plutos-menu/install.sh
# or, if Omarchy stored the clone somewhere else:
find ~ -path '*/party.plutos-menu/install.sh' -exec {} \;
```

If `flatpak` itself is missing, the installer offers to install it, then adds the Flathub remote.

## Setup › Menu Settings

| Row | What it changes |
|---|---|
| Size | Compact, Classic (the Omarchy 3 width, 295), Default (Omarchy 4, 300), Roomy, Wide |
| Dim background | Off, Veil, Dim, Dark. This is the scrim behind the menu |
| Classic keys | How the menu behaves when you open it from the keyboard |

**Classic keys on** (the Omarchy 3 way): the first row is already a highlighted button. Enter runs it or opens it. Arrows move that button. Typing filters only the folder you are in.

**Classic keys off** (Omarchy 4): the menu opens with nothing highlighted. The first Enter only arms the row. The next Enter runs it. Typing searches every nested entry, not just this folder.

Settings are written to `~/.config/omarchy/plutos-menu.json` and apply without restarting the shell.

## Multi-select, always on

There is no toggle for this. In **any Install or Remove list** inside the menu:

- **Tab** marks the highlighted app and stays in the list
- **Tab** again clears that mark
- **Enter** runs every marked app
- If nothing is marked, **Enter** runs the highlighted row, as before
- Marks are a green bar when installing and a red bar when removing

The fuzzy windows (Arch package, AUR, Flatpak, and their remove counterparts) keep the Omarchy 3 fzf controls:

- **Tab** multi-select
- **Enter** confirms
- **Alt+P** toggles the description
- **Alt+J / Alt+K** scroll it
- Green pointer when installing, red when removing

## What this is not

A theme. The menu still uses your Omarchy colors, type, and icons. Classic keys only thicken the highlighted row so it reads as a button again.

## License

MIT. See `LICENSE`. Omarchy's menu, which this plugin ships a modified copy of, remains Copyright David Heinemeier Hansson under the same license.
