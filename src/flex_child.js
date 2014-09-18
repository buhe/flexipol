/**
 * The Flex Child class
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {DOMElement}   element
 */
function FlexChild(element, index, parent) {

	this.parent = parent;

	this.isChild = true;

	// Call the super constructor first
	FlexElement.call(this, element);

	// The order inside the html
	this.index = index;

	// The row it is on
	this.row = 0;

	// Remove all custom styling
	element.style.cssText = '';
}

// Make FlexChild inherit the FlexElement methods
for (var name in FlexElement.prototype) {
	FlexChild.prototype[name] = FlexElement.prototype[name];
}

/**
 * Get the size as it is now,
 * for the direction of the parent.
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   sizeType
 */
FlexChild.prototype.getSize = function getSize(sizeType) {
	return this.getWidthOrHeight(this.parent.dimension, sizeType);
};


// Base size is when grow & shrink is zero: basis size or actual size or ...
FlexChild.prototype.getBaseSize = function getBaseSize() {

	var hasBasis,
	    curSize,
	    base,
	    min;

	min = this['min'+this.parent.dimension] != null;
	base = 0;

	// basis is practically min & max at the same time
	if (typeof this.basisSize == 'number') {
		hasBasis = true;
		base = this.basisSize;
	}

	// If there is a min size, that becomes the base
	if (min > base) {
		base = min;
	}

	curSize = this.getSize();

	if (!hasBasis && curSize > base) {
		base = curSize;
	}

	return base;
};

FlexChild.prototype.getConfig = function getConfig() {

	var shrink,
	    basis,
	    grow,
	    flex,
	    temp;

	// It's not actually 0, but for now ... leave it like this
	this.order = parseInt(this.element.getAttribute('data-flex-order')) || 0;

	grow = this.element.getAttribute('data-flex-grow');
	shrink = this.element.getAttribute('data-flex-shrink');
	basis = this.element.getAttribute('data-flex-basis');

	if (grow == null || shrink == null || basis == null) {

		flex = this.element.getAttribute('data-flex-flex');

		if (!flex || flex == 'none') {
			flex = '0 1 auto';
		}

		temp = flex.split(' ');

		if (grow == null) {
			grow = temp[0];
		}

		if (shrink == null) {
			shrink = temp[1];
		}

		if (basis == null) {
			basis = temp[2];
		}
	}

	this.grow = parseInt(grow);
	this.shrink = parseInt(shrink);
	this.basis = basis;

	if (parseInt(basis)) {
		this.basisSize = this.calc(basis);
	}

	this.align = this.element.getAttribute('data-flex-align-self') || 'auto';

	this.minwidth = parseInt(this.computed['min-width']) || null;
	this.maxwidth = parseInt(this.computed['max-width']) || null;
	this.minheight = parseInt(this.computed['min-height']) || null;
	this.maxheight = parseInt(this.computed['max-height']) || null;
};