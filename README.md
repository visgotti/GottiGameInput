# API
const inventory = new Inventory(opts);

## methods
inventory.open();

inventory.close();

inventory.addItem(item, slotIndex);

inventory.removeItem(item, slotIndex);

inventory.swapSlots(slotIndex1, slotIndex2);

inventory.selectItem(slotIndex);

inventory.equipItem(slotIndex);

## events
onAddedItem,
onRemovedItem,
onInventoryOpen,
onInventoryClose,
onDragItemStart
onDragItemEnd
onSwapSlots
onItemSelected
onItemEquipped
onItemOptionsOpen
onItemOptionsClose

