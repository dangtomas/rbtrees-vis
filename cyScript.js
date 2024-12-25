import { RED, searchNode } from "./js-impl/utils.js";
import { ClassicRBTree, rbInsert, rbDelete } from "./js-impl/classicRb.js";
import { LLRBTree, llrbInsert, llrbDelete } from "./js-impl/llrb.js";
import {
	RB23Tree,
	rb23Insert,
	rb23Delete,
} from "./js-impl/paritySeeking23Rb.js";
import {
	RB234Tree,
	rb234Insert,
	rb234Delete,
} from "./js-impl/paritySeeking234Rb.js";

const cyElementsStyle = [
	{
		selector: "node",
		style: {
			label: "data(label)",
			textValign: "center",
			textHalign: "center",
			color: "white",
			width: "40px",
			height: "40px",
			fontSize: "20px",
		},
	},

	{
		selector: '[type = "black"]',
		style: {
			backgroundColor: "black",
		},
	},

	{
		selector: '[type = "red"]',
		style: {
			backgroundColor: "red",
		},
	},

	{
		selector: '[type = "nil"]',
		style: {
			label: "NIL",
			color: "black",
			backgroundColor: "white",
			fontSize: "15px",
		},
	},

	{
		selector: "edge",
		style: {
			width: 2,
			lineColor: "black",
			curveStyle: "bezier",
			targetArrowColor: "black",
			targetArrowShape: "triangle",
		},
	},

	{
		selector: '[type = "toNil"]',
		style: {
			lineColor: "black",
			targetArrowColor: "black",
		},
	},
];

const allVariantsInfo = [
	{
		T: new ClassicRBTree(),
		cy: cytoscape({
			container: document.getElementById("classic-rb"),
			style: cyElementsStyle,
			minZoom: 0.5,
			maxZoom: 3,
		}),
		insert: rbInsert,
		delete: rbDelete,
		steps: [],
		stepDescriptionText: document.getElementById(
			"classic-rb-step-description-text"
		),
		previousButton: document.getElementById("classic-rb-previous"),
		nextButton: document.getElementById("classic-rb-next"),
		stepCounterText: document.getElementById("classic-rb-step-counter"),
		currentStep: 0,
	},
	{
		T: new LLRBTree(),
		cy: cytoscape({
			container: document.getElementById("llrb"),
			style: cyElementsStyle,
			minZoom: 0.5,
			maxZoom: 3,
		}),
		insert: llrbInsert,
		delete: llrbDelete,
		steps: [],
		stepDescriptionText: document.getElementById(
			"llrb-step-description-text"
		),
		previousButton: document.getElementById("llrb-previous"),
		nextButton: document.getElementById("llrb-next"),
		stepCounterText: document.getElementById("llrb-step-counter"),
		currentStep: 0,
	},
	{
		T: new RB23Tree(),
		cy: cytoscape({
			container: document.getElementById("parity-seeking-2-3rb"),
			style: cyElementsStyle,
			minZoom: 0.5,
			maxZoom: 3,
		}),
		insert: rb23Insert,
		delete: rb23Delete,
		steps: [],
		stepDescriptionText: document.getElementById(
			"parity-seeking-2-3rb-step-description-text"
		),
		previousButton: document.getElementById(
			"parity-seeking-2-3rb-previous"
		),
		nextButton: document.getElementById("parity-seeking-2-3rb-next"),
		stepCounterText: document.getElementById(
			"parity-seeking-2-3rb-step-counter"
		),
		currentStep: 0,
	},
	{
		T: new RB234Tree(),
		cy: cytoscape({
			container: document.getElementById("parity-seeking-2-3-4rb"),
			style: cyElementsStyle,
			minZoom: 0.5,
			maxZoom: 3,
		}),
		insert: rb234Insert,
		delete: rb234Delete,
		steps: [],
		stepDescriptionText: document.getElementById(
			"parity-seeking-2-3-4rb-step-description-text"
		),
		previousButton: document.getElementById(
			"parity-seeking-2-3-4rb-previous"
		),
		nextButton: document.getElementById("parity-seeking-2-3-4rb-next"),
		stepCounterText: document.getElementById(
			"parity-seeking-2-3-4rb-step-counter"
		),
		currentStep: 0,
	},
];

allVariantsInfo.forEach((v) => {
	v.cy.nodeHtmlLabel([
		{
			query: '[isX = "true"][isLeft = "true"]',
			halign: "left",
			valign: "center",
			tpl() {
				return `<div style="font-size: 20px; padding-right: 15px; padding-bottom: 6px;">
							<i>x</i>
						</div>`;
			},
		},
	]);
	v.cy.nodeHtmlLabel([
		{
			query: '[isX = "true"][isLeft = "false"]',
			halign: "right",
			valign: "center",
			tpl() {
				return `<div style="font-size: 20px; padding-left: 15px; padding-bottom: 6px;">
							<i>x</i>
						</div>`;
			},
		},
	]);
});

function addTreeToCy(T, x, cy, pid, isLeft) {
	if (T.root === T.NIL) {
		return;
	}
	const id =
		x === T.NIL
			? pid === null
				? "root"
				: `${isLeft ? "l" : "r"}-nil-${pid.split("-")[1]}`
			: `n-${x.key}`;
	cy.add({
		group: "nodes",
		data: {
			id,
			label: x === T.NIL ? "NIL" : x.key < 0 ? x.key * -1 : x.key,
			type: x === T.NIL ? "nil" : x.color === RED ? "red" : "black",
			p: pid === null ? "null" : pid,
			isX: "false",
			isLeft: isLeft ? "true" : "false",
		},
		grabbable: false,
	});
	if (pid !== null) {
		cy.add({
			group: "edges",
			data: {
				source: pid,
				target: id,
				type: x === T.NIL ? "toNil" : "normal",
			},
		});
	}
	if (x !== T.NIL) {
		addTreeToCy(T, x.left, cy, id, true);
		addTreeToCy(T, x.right, cy, id, false);
	}
}

function visualizeTree(T, cy, xId) {
	cy.elements().remove();
	addTreeToCy(T, T.root, cy, null, null);
	cy.layout({ name: "dagre", rankSep: 45, nodeSep: 40 }).run();
	cy.nodes('[type = "nil"]').forEach((n) => {
		const parent = cy.getElementById(n.data("p"));
		const id = n.data("id");
		n.position({
			x: parent.position("x") + (id.startsWith("l") ? -50 : 50),
			y: parent.position("y") + 90,
		});
	});
	if (xId) {
		cy.getElementById(xId).data("isX", "true");
	}
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
	document.querySelectorAll(".step-description-buttons").forEach((el) => {
		el.style.display = "none";
	});
	allVariantsInfo.forEach((v) => {
		v.T.root = v.T.NIL;
		v.steps = [];
		v.currentStep = 0;
		v.stepDescriptionText.textContent =
			"Insert or Delete a node to start the visualisation.";
		visualizeTree(v.T, v.cy);
	});
	finishedOperation = true;
});

const showLeavesCheckbox = document.getElementById("show-nil");
showLeavesCheckbox.addEventListener("change", () => {
	const checked = showLeavesCheckbox.checked;
	allVariantsInfo.forEach((v) => {
		v.cy
			.style()
			.selector('[type = "nil"]')
			.style({ color: checked ? "black" : "white" })
			.selector('[type = "toNil"]')
			.style({
				lineColor: checked ? "black" : "white",
				targetArrowColor: checked ? "black" : "white",
			})
			.update();
	});
});

let finishedOperation = true;
let finishOperationButton = document.getElementById("finish-operation-button");

finishOperationButton.addEventListener("click", () => {
	document.querySelectorAll(".step-description-buttons").forEach((el) => {
		el.style.display = "none";
	});
	allVariantsInfo.forEach((v) => {
		visualizeTree(v.steps[v.steps.length - 1].T, v.cy);
		v.steps = [];
		v.currentStep = 0;
		v.stepDescriptionText.textContent =
			"Insert or Delete a node to start the visualisation.";
	});
	finishedOperation = true;
});

const valueInput = document.getElementById("value-input");
const insertButton = document.getElementById("insert-button");
const deleteButton = document.getElementById("delete-button");

insertButton.addEventListener("click", () => {
	if (valueInput.value === "") {
		alert("Enter a value.");
		return;
	}
	const key = Number(valueInput.value);
	if (isNaN(key) || key < 0 || !Number.isInteger(key)) {
		alert("Enter a positive integer.");
	} else if (
		searchNode(allVariantsInfo[0].T, key) !== allVariantsInfo[0].T.NIL
	) {
		alert("Node with such key already exists in the tree.");
	} else if (finishedOperation === false) {
		alert("Finish the current operation first.");
		return;
	} else {
		finishedOperation = false;
		document.querySelectorAll(".step-description-buttons").forEach((el) => {
			el.style.display = "block";
		});
		allVariantsInfo.forEach((v) => {
			v.insert(v.T, key, v.steps);
			v.stepCounterText.textContent = `1 / ${v.steps.length}`;
			v.stepDescriptionText.textContent = v.steps[0].description;
			v.previousButton.disabled = true;
			v.nextButton.disabled = false;
		});
	}
	valueInput.value = "";
});

deleteButton.addEventListener("click", () => {
	if (valueInput.value === "") {
		alert("Enter a value.");
		return;
	}
	const key = Number(valueInput.value);
	if (isNaN(key) || key < 0 || !Number.isInteger(key)) {
		alert("Enter a positive integer.");
	} else if (
		searchNode(allVariantsInfo[0].T, key) === allVariantsInfo[0].T.NIL
	) {
		alert("Node with such key doesn't exist in the tree.");
	} else if (finishedOperation === false) {
		alert("Finish the current operation first.");
		return;
	} else {
		finishedOperation = false;
		document.querySelectorAll(".step-description-buttons").forEach((el) => {
			el.style.display = "block";
		});
		allVariantsInfo.forEach((v) => {
			v.delete(v.T, key, v.steps);
			v.stepCounterText.textContent = `1 / ${v.steps.length}`;
			v.stepDescriptionText.textContent = v.steps[0].description;
			v.previousButton.disabled = true;
			v.nextButton.disabled = false;
		});
	}
	valueInput.value = "";
});

allVariantsInfo.forEach((v) => {
	v.nextButton.addEventListener("click", () => {
		v.currentStep += 1;
		v.stepCounterText.textContent = `${v.currentStep + 1} / ${
			v.steps.length
		}`;
		v.stepDescriptionText.textContent = v.steps[v.currentStep].description;
		visualizeTree(
			v.steps[v.currentStep].T,
			v.cy,
			v.steps[v.currentStep].xId
		);
		v.previousButton.disabled = false;
		if (v.currentStep + 1 === v.steps.length) {
			v.nextButton.disabled = true;
		}
	});

	v.previousButton.addEventListener("click", () => {
		v.currentStep -= 1;
		v.stepCounterText.textContent = `${v.currentStep + 1} / ${
			v.steps.length
		}`;
		v.stepDescriptionText.textContent = v.steps[v.currentStep].description;
		visualizeTree(
			v.steps[v.currentStep].T,
			v.cy,
			v.steps[v.currentStep].xId
		);
		v.nextButton.disabled = false;
		if (v.currentStep === 0) {
			v.previousButton.disabled = true;
		}
	});
});

const generateRandomButton = document.getElementById("generate-random-button");
generateRandomButton.addEventListener("click", () => {
	if (allVariantsInfo[0].T.root.key !== -1) {
		alert("Empty the tree before generating a random one.");
	}
	const added = new Set();
	for (let i = 0; i < 15; i++) {
		let randomNumber = Math.floor(Math.random() * 999 + 1);
		while (added.has(randomNumber)) {
			randomNumber = Math.floor(Math.random() * 999 + 1);
		}
		allVariantsInfo.forEach((v) => {
			v.insert(v.T, randomNumber, []);
		});
	}
	allVariantsInfo.forEach((v) => {
		visualizeTree(v.T, v.cy, null);
	});
});

const resetCameraButton = document.getElementById("reset-camera-button");
resetCameraButton.addEventListener("click", () => {
	allVariantsInfo.forEach((v) => {
		v.cy.fit();
	});
});
