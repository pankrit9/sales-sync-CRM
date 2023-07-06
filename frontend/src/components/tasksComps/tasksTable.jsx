import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { BACKEND_API } from "../../api";
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple, green, red, blue } from '@mui/material/colors';

function createData(task_id, manager_assigned, task_description, client_assigned, product, product_quantity, priority, due_date, staff_member_assigned, complete) {
    return {
        task_id,
        manager_assigned,
        task_description,
        client_assigned,
        product,
        product_quantity,
        priority,
        due_date,
        staff_member_assigned,
        complete,
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    // {
    //     id: "task_id",
    //     numeric: false,
    //     disablePadding: true,
    //     label: "Task",
    // },
    {
        id: "manager_assigned",
        numeric: false,
        disablePadding: false,
        label: "Manager"
    },
    {
        id: "task_description",
        numeric: false,
        disablePadding: false,
        label: "Description",
    },
    {
        id: "client_assigned",
        numeric: false,
        disablePadding: false,
        label: "Client",
    },
    {
        id: "product",
        numeric: false,
        disablePadding: false,
        label: "Product",
    },
    // {
    //     id: "product_quantity",
    //     numeric: false,
    //     disablePadding: false,
    //     label: "Product Quantity",
    // },
    {
        id: "priority",
        numeric: false,
        disablePadding: false,
        label: "Priority",
    },
    {
        id: "due_date",
        numeric: false,
        disablePadding: false,
        label: "Due Date",
    },
    {
        id: "staff_member_assigned",
        numeric: false,
        disablePadding: false,
        label: "Assigned",
    },
    {
        id: "complete",
        numeric: false,
        disablePadding: false,
        label: "Task Status",
    },
];

function EnhancedTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, selectedIds, fetchData } = props;   
}

export default function EnhancedTable({ rows, fetchData }) {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("task_id");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };
    
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.task_id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    
    // select rows 
    const handleClick = (event, task_id) => {
        const selectedIndex = selected.indexOf(task_id);
        let newSelected = [];
        
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, task_id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
                );
            }
            
            setSelected(newSelected);
        };
        
        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };
        
        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };
        const handleChangeDense = (event) => {
            setDense(event.target.checked);
        };
        
        const isSelected = (task_id) => selected.indexOf(task_id) !== -1;
        
        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
        
        const visibleRows = React.useMemo(() =>
        stableSort(rows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
            ),
            [order, orderBy, page, rowsPerPage],
        );
                
        
        const colors = [deepOrange[500], deepOrange[300], deepPurple[500], deepPurple[300], green[500], green[300], red[500], red[300], blue[500], blue[300]];
        
        const getRandomColor = () => {
            const randomIndex = Math.floor(Math.random() * colors.length);
            return colors[randomIndex];
        };

        return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} selectedIds={selected} fetchData={fetchData} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                // const isItemSelected = isSelected(row.task_id);
                                // const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        // onClick={(event) => handleClick(event, row.task_id)}
                                        // role="checkbox"
                                        // aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.task_id}
                                        // selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            /> */}
                                        {/* </TableCell> */}
                                        <TableCell align="center">{row.manager_assigned}</TableCell>
                                        <TableCell align="centre">{row.task_description}</TableCell>
                                        <TableCell align="centre">{row.client_assigned}</TableCell>
                                        <TableCell align="centre">{row.product}</TableCell>
                                        {/* <TableCell align="centre">{row.product_quantity}</TableCell> */}
                                        <TableCell align="centre">{row.priority}</TableCell>
                                        <TableCell align="centre">{row.due_date}</TableCell>
                                        <TableCell align="centre">
                                            <Tooltip title={row.staff_member_assigned}>
                                                <Avatar sx={{ bgcolor: getRandomColor() }}>
                                                    {(row.staff_member_assigned[0]+row.staff_member_assigned[1]).toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="centre">{row.complete}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
}

