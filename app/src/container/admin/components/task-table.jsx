import React, { useState, useEffect } from "react"
import { CheckCircle2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Circle, CircleAlert, CircleHelp, ArrowUpDown, Clock, MoreHorizontal, X, XCircle, ArrowDown, ArrowUp, FileCheck, RefreshCcw, Lightbulb } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import BarChartComponent from "./ChartComponent"


export function TaskTable() {
    const [open, setOpen] = useState(false)
    const [orders, setOrders] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatusFilters, setSelectedStatusFilters] = useState(new Set());
    const [selectedPriorityFilters, setSelectedPriorityFilters] = useState(new Set());
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const getStatusValue = (status) => {
        const statusOrder = ["Pending", "Ongoing", "Done", "Cancel"];
        return statusOrder.indexOf(status);
    }

    const getPriorityValue = (priority) => {
        switch (priority) {
            case "Cao": return 1;
            case "Trung bình": return 2;
            case "Thấp": return 3;
            default: return 0;
        }
    }

    // Function to check if the order was created today
    const isCreatedToday = (createdAt) => {
        const today = new Date();
        const createdDate = new Date(createdAt);
        return (
            createdDate.getDate() === today.getDate() &&
            createdDate.getMonth() === today.getMonth() &&
            createdDate.getFullYear() === today.getFullYear()
        );
    }

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = selectedStatusFilters.size === 0 || selectedStatusFilters.has(order.status);
        const matchesPriority = selectedPriorityFilters.size === 0 || selectedPriorityFilters.has(order.priority);
        
        // Ensure order.summary and order._id are defined before calling toLowerCase
        const matchesSearch = (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) || 
                              (order.totalPrice && Math.ceil(order.totalPrice).toString().includes(searchQuery));
        
        const hasConsultationTag = order.tags && order.tags.includes("Consultation Service");
        const hasConsultationTag2 = order.tags && order.tags.includes("Service Evaluation");
        
        return matchesStatus && matchesPriority && matchesSearch && !hasConsultationTag && !hasConsultationTag2;
    }).sort((a, b) => {
        const isAToday = isCreatedToday(a.createdAt);
        const isBToday = isCreatedToday(b.createdAt);

        if (isAToday && !isBToday) return -1;
        if (!isAToday && isBToday) return 1;

        if (!sortOrder || !sortField) return 0;
        if (sortField === 'id') {
            return sortOrder === 'asc'
                ? a._id.localeCompare(b._id)
                : b._id.localeCompare(a._id);
        }
        if (sortField === 'title') {
            return sortOrder === 'asc'
                ? a.items.length - b.items.length // Sort by number of items
                : b.items.length - a.items.length;
        }
        if (sortField === 'status') {
            const statusA = getStatusValue(a.status);
            const statusB = getStatusValue(b.status);
            return sortOrder === 'asc'
                ? statusA - statusB
                : statusB - statusA;
        }
        if (sortField === 'total') {
            return sortOrder === 'asc'
                ? Math.ceil(a.totalPrice) - Math.ceil(b.totalPrice) // Sort by total price ascending
                : Math.ceil(b.totalPrice) - Math.ceil(a.totalPrice); // Sort by total price descending
        }
        return 0;
    });

    const indexOfLastOrder = currentPage * rowsPerPage;

    const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;

    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5050/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Error refreshing the order table!');
        }
    };

    // Fetch orders from API on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending":
                return <Circle className="h-4 w-4 text-yellow-500" />
            case "Ongoing":
                return <Clock className="h-4 w-4 text-blue-500" />
            case "Done":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "Cancel":
                return <XCircle className="h-4 w-4 text-red-500" />
            default:
                return <CircleHelp className="h-4 w-4 text-gray-500" />
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Cao":
                return "text-red-500"
            case "Trung bình":
                return "text-yellow-500"
            case "Thấp":
                return "text-green-500"
            default:
                return "text-black"
        }
    }

    // Utility function to truncate summary
    const truncateSummary = (summary, wordLimit) => {
        if (!summary) return ""; // Return an empty string if summary is undefined
        const words = summary.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return summary;
    };

    const handleDeleteClick = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5050/orders/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId)); // Update local state
            alert('Order deleted successfully!');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Error deleting order!');
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg mt-2 p-6">
            <div className="flex items-center border-b pb-4 justify-between">
                <div className="flex items-center">
                    <FileCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <h1 className="text-lg font-semibold">Order Table</h1>
                </div>
                <div>
                    {/* <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Drawer open={open} onOpenChange={setOpen}>
                                        <DrawerTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Lightbulb className="h-4 w-4" />
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <div className="mx-auto w-full max-w-sm">
                                                <DrawerHeader>
                                                    <DrawerTitle>Analysis Table</DrawerTitle>
                                                    <DrawerDescription>Analysis of customer feedback forms in the last 7 days.</DrawerDescription>
                                                </DrawerHeader>
                                                <div className="p-4 pb-0">
                                                    <p className="text-center text-sm font-semibold text-muted-foreground">
                                                        Bar chart dividing types of feedback forms
                                                    </p>
                                                    <BarChartComponent />
                                                </div>
                                                <DrawerFooter>
                                                    <DrawerClose asChild>
                                                        <Button variant="outline">Close</Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Analysis</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-2" onClick={fetchOrders}><RefreshCcw className="h-4 w-4" /></Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Refresh List</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> */}
                </div>
            </div>
            <div className="w-full">
                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Search by order ID or total price..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-dashed">
                                    <span>Status</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search by status..." />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup>
                                            {["Pending", "Ongoing", "Done", "Cancel"].map((status) => {
                                                const isSelected = selectedStatusFilters.has(status);
                                                return (
                                                    <CommandItem
                                                        key={status}
                                                        onSelect={() => {
                                                            const newSelected = new Set(selectedStatusFilters);
                                                            if (isSelected) {
                                                                newSelected.delete(status);
                                                            } else {
                                                                newSelected.add(status);
                                                            }
                                                            setSelectedStatusFilters(newSelected);
                                                            setStatusFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={(checked) => {
                                                                    const newSelected = new Set(selectedStatusFilters);
                                                                    if (checked) {
                                                                        newSelected.add(status);
                                                                    } else {
                                                                        newSelected.delete(status);
                                                                    }
                                                                    setSelectedStatusFilters(newSelected);
                                                                    setStatusFilter(newSelected.size ? Array.from(newSelected) : ["all"]);
                                                                }}
                                                                className="mr-2"
                                                            />
                                                            <span>{status}</span>
                                                        </div>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-dashed text-red-500"
                            onClick={() => {
                                setSelectedStatusFilters(new Set());
                                setSelectedPriorityFilters(new Set());
                                setStatusFilter("all");
                                setPriorityFilter("all");
                            }}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedTasks.length === filteredOrders.length}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTasks(filteredOrders.map((order) => order._id))
                                            } else {
                                                setSelectedTasks([])
                                                setSelectedStatusFilters(new Set());
                                                setStatusFilter("all");
                                                setPriorityFilter("all");
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="min-w-[100px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Order ID</span>
                                                {sortField === 'id' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('id');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Ascending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('id');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Descending
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Items</span>
                                                {sortField === 'title' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('title');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Ascending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('title');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Descending
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Status</span>
                                                {sortField === 'status' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('status');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Ascending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('status');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Descending
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="min-w-[100px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                                <span>Total</span>
                                                {sortField === 'total' ? (
                                                    sortOrder === 'asc' ? (
                                                        <ArrowUp className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="ml-2 h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('total');
                                                setSortOrder('asc');
                                            }}>
                                                <ArrowUp className="mr-2 h-4 w-4 text-gray-400" />
                                                Ascending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSortField('total');
                                                setSortOrder('desc');
                                            }}>
                                                <ArrowDown className="mr-2 h-4 w-4 text-gray-400" />
                                                Descending
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentOrders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTasks.includes(order._id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedTasks([...selectedTasks, order._id])
                                                } else {
                                                    setSelectedTasks(selectedTasks.filter((id) => id !== order._id))
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className="text-gray-500">
                                                            {order._id.substring(0, 10)}...
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{order._id}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {isCreatedToday(order.createdAt) && (
                                                <Badge className="bg-green-200 text-green-800 hover:bg-green-200">New</Badge>
                                            )}
                                            <div className="flex gap-1">
                                                {(order.tags || []).map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        className="bg-red-100 text-red-800 hover:bg-red-100"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-[400px] truncate">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className="text-gray-500">
                                                        {order.items.reduce((total, item) => total + item.quantity, 0)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{order.items.map(item => `Product ID: ${item.productId}, Quantity: ${item.quantity}`).join(', ')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span>{order.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`${getPriorityColor(order.priority)}`}>
                                                {Math.ceil(order.totalPrice)}$
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/orders/edit/${order._id}`)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteClick(order._id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-gray-500">
                        {selectedTasks.length} out of {filteredOrders.length} rows selected
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Rows per page</span>
                            <Select defaultValue="5">
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Page {currentPage} of {Math.ceil(filteredOrders.length / rowsPerPage)}</span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronFirst />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredOrders.length / rowsPerPage)}>
                                    <ChevronRight />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.ceil(filteredOrders.length / rowsPerPage))} disabled={currentPage >= Math.ceil(filteredOrders.length / rowsPerPage)}>
                                    <ChevronLast />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}