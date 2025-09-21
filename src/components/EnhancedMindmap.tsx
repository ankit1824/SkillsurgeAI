import React, { useMemo, useState, useRef, useEffect } from 'react';
import { MindMapNode } from '../types';

interface EnhancedMindmapProps {
    data: MindMapNode;
    className?: string;
}

interface PositionedNode extends MindMapNode {
    x: number;
    y: number;
    width: number;
    height: number;
    level: number;
    children?: PositionedNode[];
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 40;
const VERTICAL_SPACING = 80;
const LEVEL_HEIGHT = 100;

// Enhanced positioning algorithm for better mindmap layout
const assignPositions = (node: MindMapNode, x = 0, y = 0, level = 0): PositionedNode => {
    const positionedChildren = node.children?.map((child, index) => {
        const childY = y + LEVEL_HEIGHT;
        const childX = x + (index - (node.children!.length - 1) / 2) * (NODE_WIDTH + HORIZONTAL_SPACING);
        return assignPositions(child, childX, childY, level + 1);
    }) || [];

    return {
        ...node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        level,
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

const getNodeColor = (level: number, index: number) => {
    const colors = [
        'from-blue-500 to-blue-600', // Root
        'from-purple-500 to-purple-600', // Level 1
        'from-pink-500 to-pink-600', // Level 2
        'from-indigo-500 to-indigo-600', // Level 3
        'from-teal-500 to-teal-600', // Level 4
    ];
    return colors[level % colors.length];
};

const getConnectionColor = (level: number) => {
    const colors = [
        'stroke-blue-400',
        'stroke-purple-400',
        'stroke-pink-400',
        'stroke-indigo-400',
        'stroke-teal-400',
    ];
    return colors[level % colors.length];
};

export const EnhancedMindmap: React.FC<EnhancedMindmapProps> = ({ data, className = '' }) => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const positionedData = useMemo(() => assignPositions(data), [data]);
    const allNodes = useMemo(() => flattenNodes(positionedData), [positionedData]);

    const bounds = useMemo(() => {
        if (allNodes.length === 0) return { minX: 0, minY: 0, width: 200, height: 100 };
        const xs = allNodes.map(n => n.x);
        const ys = allNodes.map(n => n.y);
        const minX = Math.min(...xs) - NODE_WIDTH / 2 - 30;
        const minY = Math.min(...ys) - NODE_HEIGHT / 2 - 30;
        const maxX = Math.max(...xs) + NODE_WIDTH / 2 + 30;
        const maxY = Math.max(...ys) + NODE_HEIGHT / 2 + 30;
        return { minX, minY, width: maxX - minX, height: maxY - minY };
    }, [allNodes]);

    const handleNodeClick = (nodeName: string) => {
        setSelectedNode(selectedNode === nodeName ? null : nodeName);
    };

    if (!data) return null;

    return (
        <div className={`w-full h-full ${className}`}>
            <svg
                ref={svgRef}
                className="w-full h-auto cursor-pointer"
                viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
                style={{ minHeight: '300px' }}
            >
                <defs>
                    {/* Gradient definitions */}
                    <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="level1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="level2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                    <linearGradient id="level3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="level4Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    
                    {/* Glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Connections */}
                <g>
                    {allNodes.map(node => (
                        <g key={`connections-${node.name}`}>
                            {node.children?.map(child => (
                                <path
                                    key={`${node.name}-${child.name}`}
                                    d={`M ${node.x} ${node.y + NODE_HEIGHT/2} 
                                        Q ${(node.x + child.x) / 2} ${node.y + NODE_HEIGHT/2 + 20} 
                                        ${child.x} ${child.y - NODE_HEIGHT/2}`}
                                    fill="none"
                                    stroke={`url(#${getConnectionColor(node.level).replace('stroke-', '').replace('-400', 'Gradient')})`}
                                    strokeWidth="2"
                                    className={`${getConnectionColor(node.level)} transition-all duration-300 ${
                                        hoveredNode === node.name || hoveredNode === child.name ? 'opacity-100' : 'opacity-60'
                                    }`}
                                />
                            ))}
                        </g>
                    ))}
                </g>

                {/* Nodes */}
                <g>
                    {allNodes.map((node, index) => {
                        const isHovered = hoveredNode === node.name;
                        const isSelected = selectedNode === node.name;
                        const gradientId = node.level === 0 ? 'rootGradient' : 
                                         node.level === 1 ? 'level1Gradient' :
                                         node.level === 2 ? 'level2Gradient' :
                                         node.level === 3 ? 'level3Gradient' : 'level4Gradient';
                        
                        return (
                            <g 
                                key={`node-${node.name}-${index}`}
                                transform={`translate(${node.x - NODE_WIDTH / 2}, ${node.y - NODE_HEIGHT / 2})`}
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredNode(node.name)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onClick={() => handleNodeClick(node.name)}
                            >
                                {/* Node shadow */}
                                <rect
                                    width={NODE_WIDTH}
                                    height={NODE_HEIGHT}
                                    rx="12"
                                    ry="12"
                                    x="2"
                                    y="2"
                                    className="fill-slate-400/20"
                                />
                                
                                {/* Node background */}
                                <rect
                                    width={NODE_WIDTH}
                                    height={NODE_HEIGHT}
                                    rx="12"
                                    ry="12"
                                    fill={`url(#${gradientId})`}
                                    className={`transition-all duration-300 ${
                                        isHovered ? 'scale-105' : 'scale-100'
                                    } ${isSelected ? 'ring-4 ring-white/50' : ''}`}
                                    filter={isHovered ? 'url(#glow)' : 'none'}
                                />
                                
                                {/* Node border */}
                                <rect
                                    width={NODE_WIDTH}
                                    height={NODE_HEIGHT}
                                    rx="12"
                                    ry="12"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    className="transition-all duration-300"
                                />
                                
                                {/* Node text */}
                                <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
                                    <div className="flex items-center justify-center h-full text-center p-2">
                                        <p className={`text-sm font-semibold text-white leading-tight ${
                                            isHovered ? 'scale-105' : 'scale-100'
                                        } transition-transform duration-300`}>
                                            {node.name}
                                        </p>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </g>
            </svg>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {Array.from(new Set(allNodes.map(n => n.level))).sort().map(level => (
                    <div key={level} className="flex items-center space-x-2">
                        <div 
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                level === 0 ? 'from-blue-500 to-blue-600' :
                                level === 1 ? 'from-purple-500 to-purple-600' :
                                level === 2 ? 'from-pink-500 to-pink-600' :
                                level === 3 ? 'from-indigo-500 to-indigo-600' :
                                'from-teal-500 to-teal-600'
                            }`}
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                            Level {level + 1}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
