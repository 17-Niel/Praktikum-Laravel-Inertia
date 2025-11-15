import React, { useState, useEffect, useRef } from "react";
import { usePage, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import {
    CheckCircle2,
    Circle,
    Trash2,
    Edit,
    Plus,
    Search,
    ImageIcon,
    BarChart3,
    Target,
    Clock,
    Filter,
} from "lucide-react";

// Import Trix Editor CSS dan JS
import "trix/dist/trix.css";
import "trix";

// --- Komponen Sub: Todo Item ---
const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="group relative p-6 border border-gray-200 rounded-2xl mb-4 bg-white hover:shadow-2xl transition-all duration-300 hover:border-blue-100 hover:scale-[1.02] backdrop-blur-sm bg-opacity-95">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={() => onToggleStatus(todo)}
                        className="mt-1 transform hover:scale-110 transition-transform duration-200"
                    >
                        {todo.is_finished ? (
                            <div className="relative">
                                <CheckCircle2 className="h-7 w-7 text-emerald-500 drop-shadow-sm" />
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        ) : (
                            <Circle className="h-7 w-7 text-gray-300 hover:text-blue-400 transition-colors" />
                        )}
                    </button>

                    <div className="flex gap-4 flex-1">
                        {todo.cover_url && (
                            <div className="relative">
                                <img
                                    src={todo.cover_url}
                                    alt={todo.title}
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-md"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl"></div>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-semibold text-lg mb-2 ${
                                    todo.is_finished
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                }`}
                            >
                                {todo.title}
                            </h3>
                            {todo.description && (
                                <div
                                    className="text-gray-600 line-clamp-2 prose prose-sm max-w-none leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: todo.description,
                                    }}
                                />
                            )}
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {new Date(
                                        todo.created_at
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(todo)}
                        className="h-9 w-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        onClick={() => onDelete(todo.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Gradient Border Bottom */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
                    todo.is_finished
                        ? "bg-gradient-to-r from-emerald-400 to-green-500"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                }`}
            ></div>
        </div>
    );
};

// --- Komponen Sub: Trix Editor Wrapper ---
const TrixEditor = ({ value, onChange, placeholder, ...props }) => {
    const trixRef = useRef(null);
    const lastValueRef = useRef(value);

    useEffect(() => {
        const trixEditor = trixRef.current;

        const handleTrixChange = () => {
            if (trixEditor) {
                const newValue = trixEditor.value;
                if (newValue !== lastValueRef.current) {
                    lastValueRef.current = newValue;
                    onChange(newValue);
                }
            }
        };

        if (trixEditor) {
            trixEditor.addEventListener("trix-change", handleTrixChange);

            // Set nilai awal hanya jika berbeda
            if (value !== lastValueRef.current) {
                trixEditor.editor.loadHTML(value || "");
                lastValueRef.current = value;
            }
        }

        return () => {
            if (trixEditor) {
                trixEditor.removeEventListener("trix-change", handleTrixChange);
            }
        };
    }, [onChange]);

    // Effect untuk update value dari parent (tanpa reset cursor)
    useEffect(() => {
        if (
            trixRef.current &&
            trixRef.current.editor &&
            value !== lastValueRef.current
        ) {
            // Simpan posisi cursor
            const selection = trixRef.current.editor.getSelectedRange();

            // Update content
            trixRef.current.editor.loadHTML(value || "");
            lastValueRef.current = value;

            // Restore posisi cursor jika mungkin
            if (selection) {
                setTimeout(() => {
                    trixRef.current.editor.setSelectedRange(selection);
                }, 0);
            }
        }
    }, [value]);

    return (
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 focus-within:border-blue-500 transition-colors duration-200 shadow-sm">
            <trix-editor
                ref={trixRef}
                input="trix-input"
                placeholder={placeholder}
                className="trix-content min-h-[150px] p-4 text-sm focus:outline-none bg-white"
                {...props}
            />
            <input id="trix-input" type="hidden" value={value || ""} />
        </div>
    );
};
// --- Komponen Sub: Modal Form (Add/Edit) ---
const TodoModal = ({ isOpen, onClose, todoToEdit = null }) => {
    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            title: todoToEdit?.title || "",
            description: todoToEdit?.description || "",
            is_finished: todoToEdit?.is_finished || false,
            cover: null,
            _method: todoToEdit ? "PUT" : "POST",
            remove_cover: false, // ⬅️ PASTIKAN INI ADA
        });

    useEffect(() => {
        if (todoToEdit) {
            setData({
                title: todoToEdit.title,
                description: todoToEdit.description || "",
                is_finished: todoToEdit.is_finished,
                cover: null,
                _method: "PUT",
                remove_cover: false, // ⬅️ TAMBAHKAN INI
            });
        } else {
            reset();
            setData("_method", "POST");
        }
        clearErrors();
    }, [todoToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = todoToEdit ? `/todos/${todoToEdit.id}` : "/todos";

        // Buat FormData untuk mengirim file dan data
        const formData = new FormData();
        formData.append("_method", todoToEdit ? "PUT" : "POST");
        formData.append("title", data.title);
        formData.append("description", data.description);

        if (todoToEdit) {
            formData.append("is_finished", data.is_finished);
            formData.append(
                "remove_cover",
                data.remove_cover ? "true" : "false"
            );
        }

        if (data.cover) {
            formData.append("cover", data.cover);
        }

        // Debug: lihat data yang dikirim
        console.log("📤 Data yang dikirim ke backend:", {
            title: data.title,
            description: data.description,
            is_finished: data.is_finished,
            remove_cover: data.remove_cover,
            cover: data.cover ? data.cover.name : "null",
        });

        post(url, {
            data: formData,
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true,
        });
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-0">
            <Card className="w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 border-0 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            {todoToEdit ? "Ubah Todo" : "Tambah Todo Baru"}
                        </CardTitle>
                    </CardHeader>
                </div>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Judul Tugas
                            </label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Apa yang ingin dikerjakan?"
                                required
                                className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Deskripsi (Opsional)
                            </label>
                            <TrixEditor
                                value={data.description}
                                onChange={(value) =>
                                    setData("description", value)
                                }
                                placeholder="Tulis deskripsi detail menggunakan editor yang kaya..."
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Cover Gambar
                            </label>

                            {/* Tampilkan cover yang sudah ada */}
                            {todoToEdit?.cover_url && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Cover Saat Ini:
                                    </p>
                                    <div className="relative inline-block">
                                        <img
                                            src={todoToEdit.cover_url}
                                            alt={todoToEdit.title}
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Hapus cover gambar?"
                                                        )
                                                    ) {
                                                        // ⬇️ PERBAIKAN: Pastikan remove_cover di-set ke true
                                                        setData(
                                                            "remove_cover",
                                                            true
                                                        );
                                                        setData("cover", null);

                                                        // Opsional: Sembunyikan gambar setelah dihapus
                                                        // Anda bisa menggunakan state untuk menyembunyikan preview
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Input untuk mengubah cover */}
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="cover-upload"
                                    className="cursor-pointer flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex-1 text-center"
                                >
                                    <ImageIcon className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {todoToEdit?.cover_url
                                            ? "Ganti Cover"
                                            : "Pilih Gambar"}
                                    </span>
                                </label>
                                <input
                                    id="cover-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setData("cover", e.target.files[0]);
                                        setData("remove_cover", false); // Reset flag hapus jika pilih file baru
                                    }}
                                />
                                {data.cover && (
                                    <span className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                        ✅ {data.cover.name}
                                    </span>
                                )}
                            </div>

                            {/* Deskripsi bantuan */}
                            <p className="text-xs text-gray-500 mt-2">
                                {todoToEdit?.cover_url
                                    ? "Cover yang sudah ada akan diganti dengan gambar baru"
                                    : "Upload gambar untuk cover todo (opsional)"}
                            </p>

                            {errors.cover && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {errors.cover}
                                </p>
                            )}
                        </div>

                        {todoToEdit && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="is_finished"
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={data.is_finished}
                                    onChange={(e) =>
                                        setData("is_finished", e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_finished"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Tandai sebagai selesai
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="h-11 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-11 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Menyimpan...
                                    </div>
                                ) : (
                                    "Simpan Tugas"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

// --- Komponen Utama: Dashboard ---
export default function HomePage() {
    const { auth, todos, stats, filters, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    // State untuk search & filter
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    // Ref untuk debounce
    const searchTimeoutRef = useRef(null);

    // Debounce search yang lebih baik
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const currentSearch = search.trim();
            const currentStatus = statusFilter;

            if (
                currentSearch !== (filters.search || "") ||
                currentStatus !== (filters.status || "all")
            ) {
                router.get(
                    "/",
                    {
                        search: currentSearch,
                        status: currentStatus,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        only: ["todos", "stats", "filters", "flash"],
                    }
                );
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search, statusFilter]);

    // Handle filter change
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
    };

    // Chart Data preparation
    const chartData = [
        { name: "Selesai", value: stats.finished, color: "#10b981" },
        { name: "Belum Selesai", value: stats.unfinished, color: "#ef4444" },
    ];

    // Handlers
    const handleAdd = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };
    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };
    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus todo ini?")) {
            router.delete(`/todos/${id}`, {
                preserveState: true,
                preserveScroll: true,
                data: {
                    search: search,
                    status: statusFilter,
                },
            });
        }
    };
    const handleToggleStatus = (todo) => {
        router.post(
            `/todos/${todo.id}`,
            {
                _method: "PUT",
                is_finished: !todo.is_finished,
                title: todo.title,
                search: search,
                status: statusFilter,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Header & Stats */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                    Selamat Datang, {auth.name}! 👋
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Kelola tugas harianmu dengan mudah dan
                                    efisien.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden">
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 opacity-20">
                                            <CheckCircle2 className="h-16 w-16" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            {stats.finished}
                                        </div>
                                        <p className="text-emerald-100 font-medium">
                                            Tugas Selesai
                                        </p>
                                        <div className="w-12 h-1 bg-white rounded-full mt-3 opacity-60"></div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white overflow-hidden">
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 opacity-20">
                                            <Clock className="h-16 w-16" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            {stats.unfinished}
                                        </div>
                                        <p className="text-red-100 font-medium">
                                            Belum Selesai
                                        </p>
                                        <div className="w-12 h-1 bg-white rounded-full mt-3 opacity-60"></div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-500" />
                                    Statistik Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar (Search, Filter, Add) */}
                    <Card className="border-0 shadow-lg rounded-2xl mb-8 bg-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                                <div className="flex w-full lg:w-auto gap-3 flex-1 max-w-2xl">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                                            className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                        <select
                                            className="h-12 rounded-xl border-2 border-gray-200 bg-transparent pl-10 pr-8 text-sm shadow-sm focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                            value={statusFilter}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="all">
                                                Semua Status
                                            </option>
                                            <option value="unfinished">
                                                Belum Selesai
                                            </option>
                                            <option value="finished">
                                                Selesai
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="w-full lg:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Tambah Tugas Baru
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flash Message */}
                    {flash?.success && (
                        <Alert className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-lg">
                            <AlertDescription className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Todo List */}
                    <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {todos.data.length > 0 ? (
                                    todos.data.map((todo) => (
                                        <TodoItem
                                            key={todo.id}
                                            todo={todo}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                        <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium mb-2">
                                            {search || statusFilter !== "all"
                                                ? "Tidak ada tugas yang sesuai dengan filter."
                                                : "Belum ada tugas yang ditemukan."}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {search || statusFilter !== "all"
                                                ? "Coba ubah pencarian atau filter Anda"
                                                : "Mulai dengan menambahkan tugas pertama Anda!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {todos.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-1 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
                                {todos.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={
                                                link.url +
                                                `&search=${encodeURIComponent(
                                                    search
                                                )}&status=${statusFilter}`
                                            }
                                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                                                link.active
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-4 py-2 text-sm text-gray-400 border rounded-lg opacity-50 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modal Component */}
                    <TodoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        todoToEdit={editingTodo}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
