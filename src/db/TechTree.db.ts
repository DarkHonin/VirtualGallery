export interface TechTreeElement {
    category: "notion" | "process" | "technique" | "material" | "branch";
    markdown: string;
    title: string;
    icon: string;
}

export interface TechTreeBranch extends TechTreeElement {
    children: TechTreeNode[];
}

export type TechTreeNode = TechTreeBranch | TechTreeElement;
