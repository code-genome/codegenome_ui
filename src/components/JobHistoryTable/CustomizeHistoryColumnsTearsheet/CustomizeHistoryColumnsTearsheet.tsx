/**
  * Copyright IBM Corp. 2022, 2023
  *
  * This source code is licensed under the Apache-2.0 license found in the
  * LICENSE file in the root directory of this source tree.
  *
  */
import { Checkbox, Column, FlexGrid, IconButton, Row, Search } from '@carbon/react';
import { Tearsheet } from '@carbon/ibm-products';
import { Close, Draggable as DraggableIcon } from '@carbon/react/icons';
import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  storeHistoryCustomizedColumns,
  updateHistoryCustomizeColumnsTearsheetShow,
} from '../../../store/actions/history.actions';
import { ALL_COLUMNS } from '../../../store/reducers/historyReducer';
import styles from './CustomizeHistoryColumnsTearsheet.module.scss';
import { Theme } from '@carbon/react';

const CustomizeHistoryColumnsTearsheet = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // @ts-ignore
  const isOpen = useSelector((state) => state.history.customColumns.tearsheetIsOpen);
  // @ts-ignore
  const selectedColumns = useSelector((state) => state.history.customColumns.selectedColumns);

  const [searchString, setSearchString] = useState('');

  const getAllSelectableColumns = () => {
    let selectableColumns: any[] = [];

    for (const column of ALL_COLUMNS) {
      const selected = selectedColumns.includes(column);
      selectableColumns.push({
        key: column,
        label: t(`historyTable.headers.${column}`),
        selected,
      });
    }

    return selectableColumns;
  };

  const [allColumnHeaders, setAllColumnHeaders] = useState(
    sortBy(getAllSelectableColumns(), function (column) {
      return column.label.toLowerCase();
    })
  );

  // @ts-ignore
  let emptySelectedColumnHeaders: any[] = [];
  const [selectedColumnHeaders, setSelectedColumnHeaders] = useState(emptySelectedColumnHeaders);
  const [applyButtonDisabled, setApplyButtonDisabled] = useState(true);

  React.useEffect(() => {
    let headers: any[] = [];

    selectedColumns.forEach((selectedColumnKey) => {
      headers.push(allColumnHeaders.find((columnHeader) => columnHeader.key === selectedColumnKey));
    });

    // @ts-ignore
    setSelectedColumnHeaders(headers);
  }, [allColumnHeaders, selectedColumns]);

  const applySelection = () => {
    const columns = selectedColumnHeaders
      // @ts-ignore
      .filter((header) => header.selected === true)
      // @ts-ignore
      .map((filteredObj) => filteredObj.key);
    dispatch(storeHistoryCustomizedColumns(columns));
    dispatch(updateHistoryCustomizeColumnsTearsheetShow(false));
  };

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleSelectionChange = (event, { checked, id }) => {
    setApplyButtonDisabled(false);
    const selected = checked;
    const key = id;

    let updatedSelectedColumnHeaders: any[] = [];

    // get the index in allColumnHeaders for the checkbox just clicked.
    const columnHeaderIndex = allColumnHeaders.findIndex(
      (columnHeader) => columnHeader.key === key
    );
    // update allColumnHeaders to reflect the selection
    allColumnHeaders[parseInt('' + columnHeaderIndex)].selected = selected;

    // update the selectedColumnHeaders to reflect the selection
    if (selected) {
      const columnHeader = allColumnHeaders[parseInt('' + columnHeaderIndex)];
      updatedSelectedColumnHeaders = [...selectedColumnHeaders];

      updatedSelectedColumnHeaders.push({
        // @ts-ignore
        key,
        // @ts-ignore
        label: columnHeader.label,
        // @ts-ignore
        selected: true,
      });
    } else {
      updatedSelectedColumnHeaders = selectedColumnHeaders.filter(function (columnHeader) {
        // @ts-ignore
        return columnHeader.key !== key;
      });
    }

    if (updatedSelectedColumnHeaders.length === 0) {
      setApplyButtonDisabled(true);
    }

    setAllColumnHeaders(allColumnHeaders);
    setSelectedColumnHeaders(updatedSelectedColumnHeaders);
  };

  // return a list of Checkbox components for allColumnHeaders
  const getCheckboxList = () => {
    let columnHeaders: any[] = [...allColumnHeaders];
    let columnCheckboxes: any[] = [];

    columnCheckboxes = columnHeaders.map((columnHeader) => {
      // match the label to what has been typed into the Search box
      if (
        searchString &&
        columnHeader.label.toLowerCase().indexOf(searchString.toLowerCase()) === -1
      ) {
        return '';
      }

      return (
        <Checkbox
          className={styles.column_checkbox}
          checked={columnHeader.selected}
          id={columnHeader.key}
          key={columnHeader.key}
          indeterminate={false}
          readOnly={false}
          labelText={columnHeader.label}
          onChange={handleSelectionChange}
        />
      );
    });

    return columnCheckboxes;
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // calculate the new order once the drag operation has completed
  const onDragEnd = (result) => {
    // if dropped outside the list
    if (!result.destination) {
      return;
    }

    const reOrdereditems = reorder(
      selectedColumnHeaders,
      result.source.index,
      result.destination.index
    );

    // @ts-ignore
    setSelectedColumnHeaders(reOrdereditems);
    setApplyButtonDisabled(false);
  };

  // return the props for the delete Iconbutton on each drag component
  const getDeleteIconButtonProps = (item) => ({
    label: t('historyTable.custom_columns.remove_column', { itemLabel: item.label }),
    onClick: () => {
      // clicking the icon should remove it from the reorder list and unselect its corresponding checkbox
      handleSelectionChange({}, { checked: false, id: item.key});
    },
    renderIcon: Close,
    size: 'small',
    tooltip: true,
    tooltipDirection: 'left',
  });

  // return an Icon button component for each drag component
  const getDeleteIconButton = (item) => {
    return (
      <div className={styles.delete_icon}>
        <IconButton {...getDeleteIconButtonProps(item)} />
      </div>
    );
  };

  // display the label on each drag component
  const getItemLabel = (item) => {
    return <div className={styles.droppable_column_list_item}> {item.label} </div>;
  };

  // Return a list of column wrapped in a DragDropContext, enabling drag-drop functionality.
  // Each drag item should consist of a Carbon 'Drag' Icon, column label and a delete Iconbutton.
  // Each drag component can be dragged and dropped within the DragDropContext area to set a new column header order for the case table
  const getDragDropColumnComponent = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.droppable_area}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${styles.droppable_column_list} ${!snapshot.isDraggingOver ? styles.droppable_column_list__not_dragging : null
                  }`}>
                {selectedColumnHeaders.map((item, index) => (
                  <Draggable
                    // @ts-ignore
                    key={item.key}
                    // @ts-ignore
                    draggableId={item.key}
                    isDragDisabled={false}
                    index={index}>
                    {(innerProvided, innerSnapshot) => (
                      <div
                        ref={innerProvided.innerRef}
                        {...innerProvided.draggableProps}
                        className={`${styles.draggable_item} ${innerSnapshot.isDragging ? styles.draggable_item__dragging : null
                          }`}
                        style={{ ...innerProvided.draggableProps.style }}>
                        <div className={styles.drag_handle} {...innerProvided.dragHandleProps}>
                          <DraggableIcon size={16} className={styles.drag_icon} />
                          {getItemLabel(item)}
                        </div>
                        {getDeleteIconButton(item)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  };

  const getColumnReorderList = () => {
    return (
      <div className={styles.draggable_content_positioning}>
        <span className={styles.selected_columns_title}>
          {/* @ts-ignore */}
          {t('historyTable.custom_columns.column_selected', {
            count: selectedColumnHeaders.length,
          })}
        </span>
        <span className={styles.selected_columns_subtitle}>
          {/* @ts-ignore */}
          {t('historyTable.custom_columns.drag_to_reorder')}
        </span>
        <div className="droppable-area">{getDragDropColumnComponent()}</div>
      </div>
    );
  };

  const renderMain = () => (
    <Theme theme="g100">
    <FlexGrid fullWidth>
      <Row className={styles.main_area}>
        <Column className={styles.selectable_columns_list} lg={8}>
          <div className={styles.searchbox}>
            <Search
              id={styles.search}
              size="xl"
              light={false}
              defaultValue={''}
              labelText={t('historyTable.custom_columns.search')}
              placeholder={t('historyTable.custom_columns.search')}
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.list}>
            <section>
              <div>{allColumnHeaders.length > 0 && getCheckboxList()}</div>
            </section>
          </div>
        </Column>
        <div className="bx--col">{selectedColumnHeaders.length > 0 && getColumnReorderList()}</div>
      </Row>
    </FlexGrid>
    </Theme>
  );

  return (
    <Theme theme="g100">
      <Tearsheet
        open={isOpen}
        actions={[
          {
            key: 1,
            kind: 'primary',
            label: t('apply'),
            onClick: () => applySelection()
          },
          {
            key: 3,
            kind: 'secondary',
            label: t('cancel'),
            onClick: () => dispatch(updateHistoryCustomizeColumnsTearsheetShow(false))
          }
        ]}
        // renderSidebar={() => <></>}
        title={t('historyTable.custom_columns.customize_columns')}
        // sidebarSubtitle={t('historyTable.custom_columns.subtitle')}
        selectorPrimaryFocus=".security--tearsheet button"
        focusTrap
        portalTarget={document.getElementById('job-history-page')}
      >
        {renderMain()}
      </Tearsheet>
      </Theme>
  );
};

export default CustomizeHistoryColumnsTearsheet;
