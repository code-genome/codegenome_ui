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
import React from 'react';
import Highlighter from 'react-highlight-words';
/**
 * 
 * @param text - The text whose sub components may need to be highlighted
 * @param searchString - the text to match
 * @returns A JSX element
 */
export function getHighlightedText(text, searchString) {
  return (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={[searchString]}
      autoEscape={true}
      textToHighlight={'' + text}
    />
  );
}
