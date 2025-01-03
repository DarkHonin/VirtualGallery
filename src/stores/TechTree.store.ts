import { defineStore } from "pinia";

interface TreeConnection {
    type: "implicit" | "explicit";
    elements: [TreeElement, TreeElement];
}

export interface TreeElement {
    title: string;
    icon: string;
    connections: TreeConnection[];
    position: [number, number];
}

interface TechTreeStoreState {
    _backdropCanvas?: HTMLCanvasElement;
    _densityCanvas?: HTMLCanvasElement;
    _pan: [number, number];
    _zoom: number;
    _elements: TreeElement[];
}

const renderBackdrop = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx!.fillStyle = "black";
    ctx!.strokeStyle = "white";
    ctx!.fillRect(0, 0, width, height);
    ctx!.setLineDash([2, 2]);
    ctx!.lineWidth = 1;

    ctx!.moveTo(width / 2, 0);
    ctx!.lineTo(width / 2, height);
    ctx!.stroke();
    ctx!.moveTo(0, height / 2);
    ctx!.lineTo(width, height / 2);
    ctx!.stroke();
};

const gridSize = 100;
const disableZoom = true;

export const useTechTreeStore = defineStore("TechTreeStore", {
    state: (): TechTreeStoreState => ({
        _backdropCanvas: undefined,
        _densityCanvas: undefined,
        _pan: [0, 0],
        _zoom: 1,
        _elements: [
            {
                title: "TechTree",
                icon:
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZThlYWVkIj48cGF0aCBkPSJNMjgwLTgwdi0xNjBIMGwxNTQtMjQwSDgwbDI4MC00MDAgMTIwIDE3MiAxMjAtMTcyIDI4MCA0MDBoLTc0bDE1NCAyNDBINjgwdjE2MEg1MjB2LTE2MGgtODB2MTYwSDI4MFptMzg5LTI0MGgxNDVMNjU5LTU2MGg2N0w2MDAtNzQwbC03MSAxMDEgMTExIDE1OWgtNzRsMTAzIDE2MFptLTUyMyAwaDQyOEw0MTktNTYwaDY3TDM2MC03NDAgMjM0LTU2MGg2N0wxNDYtMzIwWm0wIDBoMTU1LTY3IDI1Mi02NyAxNTUtNDI4Wm01MjMgMEg1NjZoNzQtMTExIDE5Ny02NyAxNTUtMTQ1Wm0tMTQ5IDgwaDE2MC0xNjBabTIwMSAwWiIvPjwvc3ZnPg==",
                connections: [],
                position: [0, 0],
            },
            {
                title: "Pan",
                icon:
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZThlYWVkIj48cGF0aCBkPSJNNDgwLTgwIDMxMC0yNTBsNTctNTcgNzMgNzN2LTE2Nmg4MHYxNjVsNzItNzMgNTggNThMNDgwLTgwWk0yNTAtMzEwIDgwLTQ4MGwxNjktMTY5IDU3IDU3LTcyIDcyaDE2NnY4MEgyMzVsNzMgNzItNTggNThabTQ2MCAwLTU3LTU3IDczLTczSDU2MHYtODBoMTY1bC03My03MiA1OC01OCAxNzAgMTcwLTE3MCAxNzBaTTQ0MC01NjB2LTE2NmwtNzMgNzMtNTctNTcgMTcwLTE3MCAxNzAgMTcwLTU3IDU3LTczLTczdjE2NmgtODBaIi8+PC9zdmc+",
                connections: [],
                position: [100, 100],
            },
        ],
    }),
    getters: {
        backdropImage: ({ _backdropCanvas }) => _backdropCanvas?.toDataURL(),
        offsets: ({ _pan, _zoom }) => (mod?: number[]) =>
            _pan.map((e, i) => (e * _zoom) - (mod?.[i] ?? 0)),
    },
    actions: {
        initCanvas() {
            this._densityCanvas = document.createElement("canvas");
            this._backdropCanvas = document.createElement("canvas");
            Object.assign(this._backdropCanvas, {
                width: gridSize,
                height: gridSize,
            });

            renderBackdrop(this._backdropCanvas);
            const { innerWidth, innerHeight } = window;
            this._pan = [innerWidth / 2, innerHeight / 2];
        },

        updateZoom(dzoom: number) {
            if (disableZoom) return;
            this._zoom += dzoom;
            if (this._zoom <= 0.1) return this._zoom = 0.1;
            if (this._zoom >= 3) return this._zoom = 3;
        },

        updateLocation(delta: number[]) {
            this._pan = <[number, number]> this.offsets(delta);
        },

        loadElements() {
        },
    },
});
