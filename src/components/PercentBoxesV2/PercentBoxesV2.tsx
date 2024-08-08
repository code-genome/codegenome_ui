/**
  * ## This code is part of the Code Genome Framework.
  * ##
  * ## (C) Copyright IBM 2022-2023.
  * ## This code is licensed under the Apache License, Version 2.0. You may
  * ## obtain a copy of this license in the LICENSE.txt file in the root directory
  * ## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
  * ##
  * ## Any modifications or derivative works of this code must retain this
  * ## copyright notice, and modified files need to carry a notice indicating
  * ## that they have been altered from the originals.
  * ##
  */
import React, { FC, useEffect, useRef, useState, } from 'react';
import { createRoot } from 'react-dom/client';
export interface PercetBoxesV2Props {
    fillColor: string;
    percentage: number;
    boxCount: number;
    width?: string;
    type?: string;
}

/**
 * @description - This JSX function renders SVG boxes filled to a given percetage value as specified
 * by the percentage parameter.
 * @param props - Component properties for fill percent value, containment boxes, initial width, and type.
 * @returns A JSX element.
 */
export const PercentBoxesV2: FC<PercetBoxesV2Props> = (props) => {
    const divRef = useRef({} as any);
    const svgRef = useRef({} as any)
    const yOffset = 2;
    // ro;
    const [boxCount] = useState((props?.boxCount && props?.boxCount > 0) ? props.boxCount : 5); // defaults to percentage view.
    const [fillColor] = useState(props?.fillColor ? props.fillColor : '#0F62FE');
    const emptyFill = '#3f3f3f';
    let defaultWidth = useRef('100%' as any);
    const width = useRef(0);
    const newWidth = useRef(0);
    let propsRef = useRef(props);
    // Used to force a render from an effect
    const [xrender, setXrender] = useState(false);


    /**
     * expect one property: percentage
     * with a value between [0..1]
     * Effects run AFTER render.  If you want to cause a re-render, then
     * tweak state.
     */
    useEffect(() => {
        propsRef.current = props;
        if (props.width && props.width !== '100%') {
            if (props.width.endsWith('%')) {
                defaultWidth.current = props.width;
            } else {
                defaultWidth.current = Number(props.width);
            }
        }
        width.current = (divRef ? divRef.current.offsetWidth : defaultWidth);
        newWidth.current = (width.current * (Number(propsRef.current.percentage) / 100));
        // trigger render
        updateRects();
        setXrender(xrender !== true);
    }, [props])

    /**
     * 
     * @param percentage - how much of the box to fill [0..100]
     * @param newWidth - The width of the presentation space for the rectangle.
     * @returns a semicolon delimited string of x offsets.
     */
    function getAnnimationValuesForX(percentage: number, newWidth: number): string {
        let values = '';
        for (let i = 0; i < 10; i += 1) {
            if (i + 1 < 10) {
                values += (i * newWidth) + ';';
            } else {
                values += (i * newWidth);
            }
        }
        return values;
    }

    /**
     * 
     * @param i - The index of the border box to be created
     * @param boxCount - The total number of border boxes to create
     * @param xOffset - The initial xOffset of the first border box
     * @param yOffset - The yOffset for this border box
     * @param width - The full width of the box area in which the border box is created
     * @returns 
     */
    function getBox(i: number, boxCount: number, xOffset: number, yOffset: number, width: number) {
        return (
            <rect x={xOffset + i * (width / boxCount)} y={yOffset} width={width / boxCount} height={15} fill={'rgba(255,255,255,0)'} stroke={'#252525'} strokeWidth={'3px'} key={'rct-' + i} />
        )
    }
    /**
     * 
     * @param boxCount - The total number of border boxes to create
     * @param xOffset - The initial xOffset of the first border box
     * @param yOffset - The yOffset for this border box
     * @param width - The full width of the box area in which the border box is created
     * @returns 
     */
    function getBoxes(boxCount: number, xOffset: number, yOffset: number, width: number) {
        let silly: number[] = [];
        for (let i = 0; i < boxCount; i++) {
            silly.push(i);
        }
        return (silly.map((i) => {
            return (getBox(i, boxCount, xOffset, yOffset, width))
        }));

    }

    /**
     * 
     * @param xOffset - The initial xOffset of the box to be drawn
     * @param yOffset - The initial yOffset of the box to be drawn
     * @param width - The full width of the box area
     * @param newWidth - The amount of the full width to fill with color
     * @returns 
     */
    function getStdRects(xOffset: number, yOffset: number, width: number, newWidth: number) {

        return (
            <g width="100%" height="100%">
                <rect x={xOffset} y={yOffset} width={newWidth} height={12} fill={fillColor} />
                {newWidth < width && (
                    <rect x={newWidth} y={yOffset} width={width - newWidth} height={12} fill={emptyFill} />
                )}
                {boxCount > 0 && (
                    getBoxes(boxCount, xOffset, yOffset, width)
                )}
            </g>
        );
    }

    /**
     * 
     * @param xOffset - The initial xOffset of the box to be drawn
     * @param yOffset - The initial yOffset of the box to be drawn
     * @param newWidth - The amount of the full width to fill with color
     * @returns 
     */
    function getIndeterminateRects(xOffset: number, yOffset: number, newWidth: number) {
        return (
            <g width="100%" height="100%">
                <rect x={xOffset} y={yOffset} width={newWidth} height={12} fill={fillColor} >
                    <animate attributeName="x" values={getAnnimationValuesForX(10, newWidth)} dur={'2s'} repeatCount={'indefinite'} fill={'freeze'} />
                </rect>
                {boxCount > 0 && (
                    getBoxes(boxCount, xOffset, yOffset, width.current)
                )}
            </g>
        )
    }

    function updateRects() {
        // redraw the boxes on dimension change
        if (svgRef.current) {
            for (const child of svgRef.current.children) {
                svgRef.current.removeChild(child);
            }
            // Now redraw the boxes
            try {
                const svgRoot = createRoot(svgRef.current);
                svgRoot.render(
                    props.type === 'indeterminate' ? (getIndeterminateRects(xOffset, yOffset, newWidth.current)) : (
                        getStdRects(xOffset, yOffset, width.current, newWidth.current)
                    )
                );
            } catch (err) {
                alert(JSON.stringify(err));
            }
        }

    }

    const resizeObserver = (entries: string | any[]) => {
        window.requestAnimationFrame(() => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            if (!divRef.current || divRef.current === null) {
                return;
            }
            width.current = (divRef ? divRef.current.offsetWidth : defaultWidth);
            newWidth.current = (width.current * (Number(propsRef.current.percentage) / 100));
            updateRects();
        });
    };

    useEffect(() => {
        if (!divRef.current || divRef.current === null) {
            return;
        }
        if (typeof defaultWidth.current === 'string' || props.width === undefined) {
            const ro = new ResizeObserver(resizeObserver);
            ro.observe(divRef.current);
            const ref = divRef.current;
            return () => {
                if (ro && ref) {
                    ro?.unobserve(ref);
                }
            };
        }
    }, [divRef.current, props.width]);

    function setWidthWithTryCatch() {
        try {
            width.current = divRef.current.offsetWidth;
        } catch (err) {
            width.current = (divRef ? divRef.current.offsetWidth : defaultWidth.current);
        }
    }


    useEffect(() => {
        if (typeof defaultWidth.current === 'string' || props.width === undefined) {
            setWidthWithTryCatch();
        } else {
            width.current = (Number(defaultWidth.current));
        }
        newWidth.current = (width.current * (Number(propsRef.current.percentage) / 100));
    }, [divRef.current])

    const xOffset = 0;


    newWidth.current = (width.current * (Number(propsRef.current.percentage) / 100));
    let jsxElement = props.type === 'indeterminate' ? (getIndeterminateRects(xOffset, yOffset, newWidth.current)) : (
        getStdRects(xOffset, yOffset, width.current, newWidth.current)
    )

    return (
        <div ref={divRef} style={{ width: typeof defaultWidth.current === 'string' ? defaultWidth.current : defaultWidth.current + 'px' }}>
            <svg width="100%" height="20px" ref={svgRef}>
                {jsxElement}
            </svg>
        </div>
    );
}

export default PercentBoxesV2;