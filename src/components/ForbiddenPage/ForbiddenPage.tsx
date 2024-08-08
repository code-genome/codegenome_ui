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

import { HTTPError403 } from '@carbon/ibm-products';

export default function ForbiddenPage(props) {
  return (
    <HTTPError403
      errorCodeLabel="Error 403"
      title="Forbidden"
      description="You are not authorized to access this resource."
      links={[
        {
          text: 'Code Genome Home page',
          href: '/',
        }
      ]}
    />
  );
}
