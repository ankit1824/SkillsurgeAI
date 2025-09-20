// Fix: Create SvgMindmap component to render concept maps.
import React, { useMemo } from 'react';
import { MindMapNode } from '../types';

interface SvgMindmapProps {
    data: MindMapNode;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 50;
const HORIZONTAL_SPACING = 30;
const VERTICAL_SPACING = 60;

interface PositionedNode extends MindMapNode {
    x: number;
    y: number;
    width: number;
    children?: PositionedNode[];
}

// A simple algorithm to position nodes in a top-down tree layout
const assignPositions = (node: MindMapNode, x = 0, y = 0): PositionedNode => {
    let currentY = y + NODE_HEIGHT + VERTICAL_SPACING;
    
    const positionedChildren = node.children?.map(child => assignPositions(child, 0, currentY)) || [];

    const childrenWidth = positionedChildren.reduce((acc, child) => acc + child.width, 0) + Math.max(0, positionedChildren.length - 1) * HORIZONTAL_SPACING;
    
    const selfWidth = Math.max(NODE_WIDTH, childrenWidth);
    
    let startX = x - childrenWidth / 2;

    for (const child of positionedChildren) {
        const childXOffset = child.width / 2;
        child.x = startX + childXOffset;
        startX += child.width + HORIZONTAL_SPACING;
    }

    return {
        ...node,
        x: x,
        y: y,
        width: selfWidth,
        children: positionedChildren,
    };
};

const flattenNodes = (node: PositionedNode): PositionedNode[] => {
    let nodes: PositionedNode[] = [node];
    if (node.children) {
        node.children.forEach(child => {
            nodes = nodes.concat(flattenNodes(child));
        });
    }
    return nodes;
};

export const SvgMindmap: React.FC<SvgMindmapProps> = ({ data }) => {
    const positionedData = useMemo(() => assignPositions(data), [data]);
    const allNodes = useMemo(() => flattenNodes(positionedData), [positionedData]);

    const bounds = useMemo(() => {
        if (allNodes.length === 0) return { minX: 0, minY: 0, width: 200, height: 100 };
        const xs = allNodes.map(n => n.x);
        const ys = allNodes.map(n => n.y);
        const minX = Math.min(...xs) - NODE_WIDTH / 2 - 20;
        const minY = Math.min(...ys) - 20;
        const maxX = Math.max(...xs) + NODE_WIDTH / 2 + 20;
        const maxY = Math.max(...ys) + NODE_HEIGHT + 20;
        return { minX, minY, width: maxX - minX, height: maxY - minY };
    }, [allNodes]);

    if (!data) return null;

    return (
        <svg
            className="w-full h-auto"
            viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
            style={{ minHeight: '250px' }}
        >
            <g>
                {allNodes.map(node => (
                    <g key={node.name + node.x + node.y}>
                        {node.children?.map(child => (
                            <path
                                key={`${node.name}-${child.name}`}
                                d={`M ${node.x} ${node.y + NODE_HEIGHT/2} C ${node.x} ${child.y}, ${child.x} ${node.y}, ${child.x} ${child.y}`}
                                fill="none"
                                stroke="#60a5fa"
                                strokeWidth="1.5"
                            />
                        ))}
                    </g>
                ))}
                {allNodes.map(node => (
                    <g key={node.name + node.x + node.y} transform={`translate(${node.x - NODE_WIDTH / 2}, ${node.y - NODE_HEIGHT / 2})`}>
                         <rect
                            width={NODE_WIDTH}
                            height={NODE_HEIGHT}
                            rx="8"
                            ry="8"
                            className="fill-sky-50 dark:fill-slate-700 stroke-sky-200 dark:stroke-slate-600"
                            strokeWidth="1"
                        />
                        <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
                           <div className="flex items-center justify-center h-full text-center p-1" style={{'textAlign': 'center'} as React.CSSProperties}>
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                    {node.name}
                                </p>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </g>
        </svg>
    );
};
