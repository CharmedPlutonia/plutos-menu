// Pluto's Menu — behavior the stock Omarchy 4 menu does not ship.
// Loaded beside Menu.qml. Keep this file free of QML.

var PLUTO_SIZES = {
  compact: 240,
  classic: 295,
  "default": 300,
  roomy: 380,
  wide: 480
}

var PLUTO_DIMS = {
  off: 0,
  veil: 0.22,
  dim: 0.45,
  dark: 0.72
}

var PLUTO_SIZE_LABELS = {
  compact: "Compact",
  classic: "Classic",
  "default": "Default",
  roomy: "Roomy",
  wide: "Wide"
}

var PLUTO_DIM_LABELS = {
  off: "Off",
  veil: "Veil",
  dim: "Dim",
  dark: "Dark"
}

function defaults() {
  return { size: "classic", dim: "dim", classicKeys: true }
}

function parse(text) {
  var base = defaults()
  if (!text || !String(text).trim()) return base
  try {
    var raw = JSON.parse(text)
    if (!raw || typeof raw !== "object") return base
    if (PLUTO_SIZES[raw.size]) base.size = raw.size
    if (PLUTO_DIMS[raw.dim] !== undefined) base.dim = raw.dim
    if (typeof raw.classicKeys === "boolean") base.classicKeys = raw.classicKeys
    return base
  } catch (e) {
    return null
  }
}

function serialize(settings) {
  var value = settings || defaults()
  return JSON.stringify({
    size: PLUTO_SIZES[value.size] ? value.size : "classic",
    dim: PLUTO_DIMS[value.dim] !== undefined ? value.dim : "dim",
    classicKeys: value.classicKeys !== false
  }, null, 2) + "\n"
}

function widthUnits(settings) {
  var size = settings && settings.size
  return PLUTO_SIZES[size] || PLUTO_SIZES.classic
}

function dimAlpha(settings) {
  var dim = settings && settings.dim
  return PLUTO_DIMS[dim] !== undefined ? PLUTO_DIMS[dim] : PLUTO_DIMS.dim
}

function applySetting(settings, spec) {
  var next = {
    size: (settings && settings.size) || "classic",
    dim: (settings && settings.dim) || "dim",
    classicKeys: !(settings && settings.classicKeys === false)
  }
  var parts = String(spec || "").trim().split(/\s+/)
  var key = parts[0]
  var value = parts.slice(1).join(" ")
  if (key === "size" && PLUTO_SIZES[value]) next.size = value
  else if (key === "dim" && PLUTO_DIMS[value] !== undefined) next.dim = value
  else if (key === "classicKeys") next.classicKeys = value !== "off"
  return next
}

function blankItem(id, raw) {
  var value = raw || {}
  var parent = value.parent
  if (!parent) parent = id.indexOf(".") >= 0 ? id.split(".").slice(0, -1).join(".") : "root"
  return {
    id: id,
    parent: parent,
    kind: value.action ? "action" : "menu",
    icon: value.icon || "",
    iconFont: "",
    label: value.label || id,
    title: value.title || "",
    target: "",
    description: value.description || "",
    action: value.action || "",
    provider: "",
    aliases: [],
    searchTerms: [],
    when: "",
    checked: "",
    disabled: "",
    order: 0
  }
}

function copyItem(entry) {
  var copy = {}
  for (var key in entry) copy[key] = entry[key]
  return copy
}

function insertEntry(nextItems, nextOrder, entry, firstOfParent) {
  if (nextItems[entry.id]) {
    var prior = nextItems[entry.id]
    for (var key in entry) prior[key] = entry[key]
    prior.id = entry.id
    return
  }
  var parent = entry.parent
  var insertAt = nextOrder.length
  if (firstOfParent) {
    for (var i = 0; i < nextOrder.length; i++) {
      if (nextItems[nextOrder[i]] && nextItems[nextOrder[i]].parent === parent) {
        insertAt = i
        break
      }
    }
  } else {
    for (var j = nextOrder.length - 1; j >= 0; j--) {
      if (nextItems[nextOrder[j]] && nextItems[nextOrder[j]].parent === parent) {
        insertAt = j + 1
        break
      }
    }
  }
  nextItems[entry.id] = entry
  nextOrder.splice(insertAt, 0, entry.id)
}

function flatpakCommand(scriptName) {
  var finder = "for d in \"$HOME/.config/omarchy/plugins/party.plutos-menu/bin\" \"$HOME/.local/share/omarchy/plugins/party.plutos-menu/bin\" \"$HOME/.local/bin\"; do if [ -f \"$d/" + scriptName + "\" ]; then exec bash \"$d/" + scriptName + "\"; fi; done; echo \"Pluto's Menu: " + scriptName + " not found\" >&2; exit 1"
  return "xdg-terminal-exec --app-id=org.omarchy.terminal bash -lc " + quote(finder)
}

function quote(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'"
}

function tick(on) {
  return on ? "  ✓" : ""
}

// Fresh maps only. Never write into the objects Menu.qml is holding.
function inject(items, itemOrder, settings) {
  var nextItems = {}
  var nextOrder = []
  var source = items || {}
  var order = itemOrder || []
  for (var i = 0; i < order.length; i++) {
    var id = order[i]
    if (!source[id]) continue
    nextItems[id] = copyItem(source[id])
    nextOrder.push(id)
  }

  var current = settings || defaults()
  var size = current.size || "classic"
  var dim = current.dim || "dim"
  var classic = current.classicKeys !== false

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings", {
    parent: "setup",
    icon: "󰢻",
    label: "Menu Settings",
    title: "Menu Settings",
    description: "Size, background dim, classic keys"
  }), true)

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.size", {
    parent: "setup.menu-settings",
    icon: "󰩨",
    label: "Size",
    title: "Menu size",
    description: PLUTO_SIZE_LABELS[size] || "Classic"
  }), false)

  var sizes = ["compact", "classic", "default", "roomy", "wide"]
  for (var s = 0; s < sizes.length; s++) {
    var sizeId = sizes[s]
    insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.size." + sizeId, {
      parent: "setup.menu-settings.size",
      label: PLUTO_SIZE_LABELS[sizeId] + tick(size === sizeId),
      description: sizeId === "classic" ? "Omarchy 3 width, 295" : (sizeId === "default" ? "Omarchy 4 width, 300" : ""),
      action: "plutos-setting size " + sizeId
    }), false)
  }

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.dim", {
    parent: "setup.menu-settings",
    icon: "󰖔",
    label: "Dim background",
    title: "Dim background",
    description: PLUTO_DIM_LABELS[dim] || "Dim"
  }), false)

  var dims = ["off", "veil", "dim", "dark"]
  for (var d = 0; d < dims.length; d++) {
    var dimId = dims[d]
    insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.dim." + dimId, {
      parent: "setup.menu-settings.dim",
      label: PLUTO_DIM_LABELS[dimId] + tick(dim === dimId),
      action: "plutos-setting dim " + dimId
    }), false)
  }

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.classic", {
    parent: "setup.menu-settings",
    icon: "󰌌",
    label: "Classic keys",
    title: "Classic keys",
    description: "Omarchy 3 button behavior when the menu opens"
  }), false)

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.classic.on", {
    parent: "setup.menu-settings.classic",
    label: "On" + tick(classic),
    description: "First row is a button. Enter runs it. Typing filters this folder.",
    action: "plutos-setting classicKeys on"
  }), false)

  insertEntry(nextItems, nextOrder, blankItem("setup.menu-settings.classic.off", {
    parent: "setup.menu-settings.classic",
    label: "Off" + tick(!classic),
    description: "Omarchy 4. Enter arms the row first. Typing searches every menu.",
    action: "plutos-setting classicKeys off"
  }), false)

  insertEntry(nextItems, nextOrder, blankItem("install.flatpak", {
    parent: "install",
    icon: "󰏖",
    label: "Flatpak",
    description: "Fuzzy Flathub installer, tab to mark several",
    action: flatpakCommand("plutos-flatpak-install")
  }), false)

  insertEntry(nextItems, nextOrder, blankItem("remove.flatpak", {
    parent: "remove",
    icon: "󰏖",
    label: "Flatpak",
    description: "Fuzzy remove for installed Flatpaks",
    action: flatpakCommand("plutos-flatpak-remove")
  }), false)

  moveAfter(nextOrder, "install.flatpak", "install.aur")
  moveAfter(nextOrder, "remove.flatpak", "remove.aur")
  if (nextOrder.indexOf("remove.aur") < 0) moveAfter(nextOrder, "remove.flatpak", "remove.package")

  for (var n = 0; n < nextOrder.length; n++) nextItems[nextOrder[n]].order = n
  return { items: nextItems, itemOrder: nextOrder }
}

function moveAfter(order, id, afterId) {
  var from = order.indexOf(id)
  var after = order.indexOf(afterId)
  if (from < 0 || after < 0) return
  order.splice(from, 1)
  after = order.indexOf(afterId)
  order.splice(after + 1, 0, id)
}

function unwrapAction(action) {
  var text = String(action || "")
  var presented = text.match(/omarchy-launch-floating-terminal-with-presentation\s+(.+)$/)
  if (presented) return presented[1]
  var terminal = text.match(/xdg-terminal-exec\s+\S+\s+(.+)$/)
  if (terminal) return terminal[1]
  return text
}

function batchCommand(actions) {
  var parts = []
  for (var i = 0; i < actions.length; i++) {
    if (actions[i]) parts.push("{ " + unwrapAction(actions[i]) + "; }")
  }
  if (parts.length === 0) return ""
  if (parts.length === 1) return actions[0]
  return "xdg-terminal-exec --app-id=org.omarchy.terminal bash -lc " + quote(parts.join(" && "))
}
