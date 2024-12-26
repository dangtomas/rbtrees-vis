import { RED, LEFT, searchNode } from "./js-impl/utils.js";
import { ClassicRBTree, rbInsert, rbDelete } from "./js-impl/classicRb.js";
import { LLRBTree, llrbInsert, llrbDelete } from "./js-impl/llrb.js";
import { RB23Tree, rb23Insert, rb23Delete } from "./js-impl/paritySeeking23Rb.js";
import { RB234Tree, rb234Insert, rb234Delete } from "./js-impl/paritySeeking234Rb.js";

const cySettings = {
	style: [
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
	],
	minZoom: 0.5,
	maxZoom: 3,
	pan: { x: 360, y: 240 },
	zoom: 1.5,
	wheelSensitivity: 0.2,
}

const allVariantsInfo = [
	{
		T: new ClassicRBTree(),
		cy: cytoscape({ container: document.getElementById("classic-rb"), ...cySettings }),
		insert: rbInsert,
		delete: rbDelete,
		steps: [],
		stepDescriptionText: document.getElementById("classic-rb-step-description-text"),
		previousButton: document.getElementById("classic-rb-previous"),
		nextButton: document.getElementById("classic-rb-next"),
		stepCounterText: document.getElementById("classic-rb-step-counter"),
		currentStep: 0,
	},
	{
		T: new LLRBTree(),
		cy: cytoscape({ container: document.getElementById("llrb"), ...cySettings }),
		insert: llrbInsert,
		delete: llrbDelete,
		steps: [],
		stepDescriptionText: document.getElementById("llrb-step-description-text"),
		previousButton: document.getElementById("llrb-previous"),
		nextButton: document.getElementById("llrb-next"),
		stepCounterText: document.getElementById("llrb-step-counter"),
		currentStep: 0,
	},
	{
		T: new RB23Tree(),
		cy: cytoscape({ container: document.getElementById("parity-seeking-2-3rb"), ...cySettings }),
		insert: rb23Insert,
		delete: rb23Delete,
		steps: [],
		stepDescriptionText: document.getElementById("parity-seeking-2-3rb-step-description-text"),
		previousButton: document.getElementById("parity-seeking-2-3rb-previous"),
		nextButton: document.getElementById("parity-seeking-2-3rb-next"),
		stepCounterText: document.getElementById("parity-seeking-2-3rb-step-counter"),
		currentStep: 0,
	},
	{
		T: new RB234Tree(),
		cy: cytoscape({ container: document.getElementById("parity-seeking-2-3-4rb"), ...cySettings }),
		insert: rb234Insert,
		delete: rb234Delete,
		steps: [],
		stepDescriptionText: document.getElementById("parity-seeking-2-3-4rb-step-description-text"),
		previousButton: document.getElementById("parity-seeking-2-3-4rb-previous"),
		nextButton: document.getElementById("parity-seeking-2-3-4rb-next"),
		stepCounterText: document.getElementById("parity-seeking-2-3-4rb-step-counter"),
		currentStep: 0,
	},
];

allVariantsInfo.forEach(v => {
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

function getNilNodeId(pId, isLeft) {
	return `${isLeft ? "l" : "r"}-nil-${pId.split("-")[1]}`;
}

function addTreeToCy(T, x, cy, pId, isLeft) {
	if (T.root === T.NIL) {
		return;
	}
	const id = x === T.NIL ? getNilNodeId(pId, isLeft) : `n-${x.key}`;
	cy.add({
		group: "nodes",
		data: {
			id,
			label: x === T.NIL ? "NIL" : x.key < 0 ? x.key * -1 : x.key,
			type: x === T.NIL ? "nil" : x.color === RED ? "red" : "black",
			p: pId === null ? "null" : pId,
			isX: "false",
			isLeft: isLeft ? "true" : "false",
		},
		grabbable: false,
	});
	if (pId !== null) {
		cy.add({
			group: "edges",
			data: {
				id: `${pId};${id}`,
				source: pId,
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
	cy.layout({ 
		name: "dagre", 
		rankSep: 45, 
		nodeSep: 40, fit: 
		autoFitTreesEnabled 
	}).run();
	cy.nodes('[type = "nil"]').forEach(n => {
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

function getCyNodePositions(cy) {
	return cy.nodes().map(node => ({ id: node.id(), position: node.position() }))
}

function fitTrees() {
	allVariantsInfo.forEach(v => v.cy.fit());
}

function animateRotation(T, nextT, cy, dir, key) {
	visualizeTree(nextT, cy, null);
	let newPositions = getCyNodePositions(cy);
	visualizeTree(T, cy, null);

	const x = searchNode(T, key);
	const y = dir === LEFT ? x.right : x.left;
	const yChild = dir === LEFT ? y.left : y.right;
	const p = x.p;

	cy.remove(cy.getElementById(`n-${x.key};n-${y.key}`));
	let yChildId;
	if (yChild === T.NIL) {
		yChildId = getNilNodeId(`n-${y.key}`, dir === LEFT);
		newPositions = newPositions.map(({ id, position }) => {
			if (id === getNilNodeId(`n-${x.key}`, !(dir === LEFT))) {
				return { id: yChildId, position };
			}
			return { id, position };
		});
	} else {
		yChildId = `n-${yChild.key}`;
	}
	setTimeout(() => {
		cy.add({
			group: "edges",
			data: {
				id: `n-${x.key};${yChildId}`,
				source: `n-${x.key}`,
				target: yChildId,
				type: yChild === T.NIL ? "toNil" : "normal",
			},
		});
	}, 500);

	cy.remove(cy.getElementById(`n-${y.key};${yChildId}`));
	cy.add({
		group: "edges",
		data: {
			id: `n-${y.key};n-${x.key}`,
			source: `n-${y.key}`,
			target: `n-${x.key}`,
			type: "normal",
		},
	});

	if (p !== T.NIL) {
		cy.remove(cy.getElementById(`n-${p.key};n-${x.key}`));
		setTimeout(() => {
			cy.add({
				group: "edges",
				data: {
					id: `n-${p.key};n-${y.key}`,
					source: `n-${p.key}`,
					target: `n-${y.key}`,
					type: "normal",
				},
			});
		}, 500);
	}

	cy.batch(() => {
		newPositions.forEach(({ id, position }) => {
			const node = cy.getElementById(id);
			node.animate(
				{ position: position },
				{ duration: 1000, easing: "ease-in-out" }
			);
		});
	});
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
		visualizeTree(v.T, v.cy, null);
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
	if (finishedOperation) {
		alert("There is no operation to finish.");
		return;
	}
	document.querySelectorAll(".step-description-buttons").forEach((el) => {
		el.style.display = "none";
	});
	allVariantsInfo.forEach((v) => {
		visualizeTree(v.steps[v.steps.length - 1].T, v.cy, null);
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
	if (isNaN(key) || key < 0 || !Number.isInteger(key) || key > 999) {
		alert("Enter a positive integer.");
	} else if ( searchNode(allVariantsInfo[0].T, key) !== allVariantsInfo[0].T.NIL) {
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
	} else if (searchNode(allVariantsInfo[0].T, key) === allVariantsInfo[0].T.NIL) {
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
		let timeoutDuration = 0;

		if (v.steps[v.currentStep].rotate && rotateAnimationEnabled) {
			v.nextButton.disabled = true;
			v.previousButton.disabled = true;
			timeoutDuration = 1500;
			animateRotation(
				v.steps[v.currentStep].T,
				v.steps[v.currentStep + 1].T,
				v.cy,
				v.steps[v.currentStep].rotate.dir,
				v.steps[v.currentStep].rotate.key
			);
		}

		setTimeout(() => {
			v.currentStep += 1;
			v.nextButton.disabled = v.currentStep + 1 === v.steps.length;
			v.stepCounterText.textContent = `${v.currentStep + 1} / ${v.steps.length}`;
			v.stepDescriptionText.textContent = v.steps[v.currentStep].description;
			visualizeTree(v.steps[v.currentStep].T, v.cy, v.steps[v.currentStep].xId);
			v.previousButton.disabled = false;
		}, timeoutDuration);
	});

	v.previousButton.addEventListener("click", () => {
		v.currentStep -= 1;
		v.stepCounterText.textContent = `${v.currentStep + 1} / ${v.steps.length}`;
		v.stepDescriptionText.textContent = v.steps[v.currentStep].description;
		visualizeTree(v.steps[v.currentStep].T, v.cy, v.steps[v.currentStep].xId);
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
		return;
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
	fitTrees();
});

const fitTreesButton = document.getElementById("fit-trees-button");
fitTreesButton.addEventListener("click", fitTrees);

let rotateAnimationEnabled = true;
const enableRotateAnimationCheckbox = document.getElementById(
	"enable-rotate-animation"
);
enableRotateAnimationCheckbox.addEventListener("change", () => {
	rotateAnimationEnabled = enableRotateAnimationCheckbox.checked;
});

let autoFitTreesEnabled = false;
const autoFitTreesCheckbox = document.getElementById("auto-fit-trees");
autoFitTreesCheckbox.addEventListener("change", () => {
	autoFitTreesEnabled = autoFitTreesCheckbox.checked;
});
