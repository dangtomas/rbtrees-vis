import { RED, searchNode } from "./js-impl/utils.js";
import { ClassicRBTree, rbInsert, rbDelete } from "./js-impl/classicRb.js";
import { LLRBTree, llrbInsert, llrbDelete } from "./js-impl/llrb.js";
import { RB23Tree, rb23Insert, rb23Delete } from "./js-impl/paritySeeking23Rb.js";
import { RB234Tree, rb234Insert, rb234Delete } from "./js-impl/paritySeeking234Rb.js";

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
		}),
		insert: rbInsert,
		delete: rbDelete,
	},
	{
		T: new LLRBTree(),
		cy: cytoscape({
			container: document.getElementById("llrb"),
			style: cyElementsStyle,
		}),
		insert: llrbInsert,
		delete: llrbDelete,
	},
	{
		T: new RB23Tree(),
		cy: cytoscape({
			container: document.getElementById("parity-seeking-2-3rb"),
			style: cyElementsStyle,
		}),
		insert: rb23Insert,
		delete: rb23Delete,
	},
	{
		T: new RB234Tree(),
		cy: cytoscape({
			container: document.getElementById("parity-seeking-2-3-4rb"),
			style: cyElementsStyle,
		}),
		insert: rb234Insert,
		delete: rb234Delete,
	},
];

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
			label: x === T.NIL ? "NIL" : x.key,
			type: x === T.NIL ? "nil" : x.color === RED ? "red" : "black",
			p: pid === null ? "null" : pid
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

function visualizeAllTrees() {
	allVariantsInfo.forEach((v) => {
		v.cy.elements().remove();
		addTreeToCy(v.T, v.T.root, v.cy, null, null);
		v.cy.layout({ name: "dagre" }).run();
		v.cy.nodes('[type = "nil"]').forEach(n => {
			const parent = v.cy.getElementById(n.data("p"));
			const id = n.data("id");
			n.position({
				x: parent.position("x") + (id.startsWith("l") ? -40 : 40),
				y: parent.position("y") + 80
			})
		})
	});
}

const valueInput = document.getElementById("value-input");
const deleteButton = document.getElementById("delete-button");
const insertButton = document.getElementById("insert-button");

deleteButton.addEventListener("click", () => {
	if (valueInput.value === "") {
		alert("Enter a value.")
		return;
	}
	const key = Number(valueInput.value);
	if (isNaN(key)) {
		alert("Enter a valid number.");
	} else if (
		searchNode(allVariantsInfo[0].T, key) === allVariantsInfo[0].T.NIL
	) {
		alert("Node with such key doesn't exist in the tree.");
	} else {
		allVariantsInfo.forEach((v) => v.delete(v.T, key));
		visualizeAllTrees();
	}
	valueInput.value = "";
});

insertButton.addEventListener("click", () => {
	if (valueInput.value === "") {
		alert("Enter a value.")
		return;
	}
	const key = Number(valueInput.value);
	if (isNaN(key)) {
		alert("Enter a valid number.");
	} else if (
		searchNode(allVariantsInfo[0].T, key) !== allVariantsInfo[0].T.NIL
	) {
		alert("Node with such key already exists in the tree.");
	} else {
		allVariantsInfo.forEach((v) => v.insert(v.T, key));
		visualizeAllTrees();
	}
	valueInput.value = "";
});

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", () => {
	allVariantsInfo.forEach(v => {
		v.T.root = v.T.NIL;
		visualizeAllTrees();
	})
})

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

