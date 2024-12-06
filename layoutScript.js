const variant1Selector = document.getElementById("variant1-selector");
let variant1Current = "classic-rb";
const variant2Selector = document.getElementById("variant2-selector");
let variant2Current = "llrb";

const singleTreeButton = document.getElementById("single-tree");
const sideToSideButton = document.getElementById("side-to-side");
let sideToSide = true;

const wrapper = document.getElementById("wrapper");

function getVariantDiv(variant) {
	switch (variant) {
		case "classic-rb":
			return document.getElementById("classic-rb");
		case "llrb":
			return document.getElementById("llrb");
		case "parity-seeking-2-3rb":
			return document.getElementById("parity-seeking-2-3rb");
		case "parity-seeking-2-3-4rb":
			return document.getElementById("parity-seeking-2-3-4rb");
	}
}

function hideVariantDiv(variant, order) {
	const toHideDiv = getVariantDiv(variant);
	toHideDiv.style.display = "none";
}

function showVariantDiv(variant, order) {
	let toShowDiv = getVariantDiv(variant);
	toShowDiv.style.display = "block";
	toShowDiv.style.order = order;
}

function handleVariantChange(selector) {
	if (variant1Selector.value === variant2Selector.value && sideToSide) {
		alert(
			"This variant is already being shown, try choosing a different one."
		);
		if (selector === 1) {
			variant1Selector.value = variant1Current;
		} else {
			variant2Selector.value = variant2Current;
		}
	} else {
		hideVariantDiv(
			selector === 1 ? variant1Current : variant2Current,
			selector
		);
		showVariantDiv(
			selector === 1 ? variant1Selector.value : variant2Selector.value,
			selector
		);

		if (selector === 1) {
			variant1Current = variant1Selector.value;
		} else {
			variant2Current = variant2Selector.value;
		}
	}
}

variant1Selector.addEventListener("change", () => {
	handleVariantChange(1);
});
variant2Selector.addEventListener("change", () => {
	handleVariantChange(2);
});

singleTreeButton.addEventListener("click", () => {
	if (singleTreeButton.classList.contains("active-button")) {
		return;
	} else {
		sideToSide = false;
		hideVariantDiv(variant2Current);
		variant2Selector.style.display = "none";
		sideToSideButton.classList.remove("active-button");
		singleTreeButton.classList.add("active-button");
		wrapper.style.background = "none";
	}
});

sideToSideButton.addEventListener("click", () => {
	if (sideToSideButton.classList.contains("active-button")) {
		return;
	} else {
		sideToSide = true;
		showVariantDiv(variant2Current, 2);
		variant2Selector.style.display = "block";
		singleTreeButton.classList.remove("active-button");
		sideToSideButton.classList.add("active-button");
		wrapper.style.background =
			"linear-gradient(#000, #000) no-repeat center/1px 100%";
	}
});
