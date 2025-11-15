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
    X,
} from "lucide-react";

import "trix/dist/trix.css";
import "trix";

const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="group relative p-6 border border-gray-200 rounded-3xl mb-6 bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-purple-300 shadow-lg">
            <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4 flex-1">
                    <button
                        onClick={() => onToggleStatus(todo)}
                        className="mt-1 transform hover:scale-110 transition-transform duration-300 flex-shrink-0 group"
                    >
                        {todo.is_finished ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-60"></div>
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 relative drop-shadow-lg" />
                            </div>
                        ) : (
                            <div className="p-2 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 shadow-inner border border-gray-200">
                                <Circle className="h-6 w-6 text-blue-500 hover:text-purple-500 transition-colors" />
                            </div>
                        )}
                    </button>

                    <div className="flex gap-4 flex-1">
                        {todo.cover_url && (
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-md opacity-30"></div>
                                <img
                                    src={todo.cover_url}
                                    alt={todo.title}
                                    className="w-24 h-24 object-cover rounded-2xl border-2 border-white shadow-xl relative"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-bold text-xl mb-3 bg-linear-to-r ${
                                    todo.is_finished
                                        ? "from-gray-400 to-gray-500 line-through"
                                        : "from-gray-800 to-purple-700"
                                } bg-clip-text text-transparent`}
                            >
                                {todo.title}
                            </h3>
                            {todo.description && (
                                <div
                                    className="text-gray-600 line-clamp-2 prose prose-sm max-w-none leading-relaxed bg-gray-50/80 rounded-xl p-4 border border-gray-100"
                                    dangerouslySetInnerHTML={{
                                        __html: todo.description,
                                    }}
                                />
                            )}
                            <div className="flex items-center gap-3 mt-4 text-sm text-gray-500 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-2.5 w-fit border border-gray-200">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">
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

                <div className="flex items-center gap-3 ml-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(todo)}
                        className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 hover:border-blue-300 hover:scale-110 transition-all duration-300 shadow-lg"
                    >
                        <Edit className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-linear-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 hover:border-red-300 hover:scale-110 transition-all duration-300 shadow-lg"
                        onClick={() => onDelete(todo.id)}
                    >
                        <Trash2 className="h-5 w-5 text-red-600" />
                    </Button>
                </div>
            </div>

            <div
                className={`absolute bottom-0 left-0 right-0 h-2 rounded-b-3xl ${
                    todo.is_finished
                        ? "bg-linear-to-r from-emerald-400 via-green-500 to-emerald-600"
                        : "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
                }`}
            ></div>
        </div>
    );
};

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

    useEffect(() => {
        if (
            trixRef.current &&
            trixRef.current.editor &&
            value !== lastValueRef.current
        ) {
            const selection = trixRef.current.editor.getSelectedRange();
            trixRef.current.editor.loadHTML(value || "");
            lastValueRef.current = value;

            if (selection) {
                setTimeout(() => {
                    trixRef.current.editor.setSelectedRange(selection);
                }, 0);
            }
        }
    }, [value]);

    return (
        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-purple-400 focus-within:border-purple-500 transition-all duration-300 shadow-lg bg-white">
            <trix-editor
                ref={trixRef}
                input="trix-input"
                placeholder={placeholder}
                className="trix-content min-h-[150px] p-6 text-sm focus:outline-none bg-white text-gray-800 rounded-2xl"
                {...props}
            />
            <input id="trix-input" type="hidden" value={value || ""} />
        </div>
    );
};

const TodoModal = ({ isOpen, onClose, todoToEdit = null }) => {
    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            title: todoToEdit?.title || "",
            description: todoToEdit?.description || "",
            is_finished: todoToEdit?.is_finished || false,
            cover: null,
            _method: todoToEdit ? "PUT" : "POST",
            remove_cover: false,
        });

    useEffect(() => {
        if (todoToEdit) {
            setData({
                title: todoToEdit.title,
                description: todoToEdit.description || "",
                is_finished: todoToEdit.is_finished,
                cover: null,
                _method: "PUT",
                remove_cover: false,
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

        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-4xl animate-in zoom-in-95 duration-300">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="relative bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 p-10">
                        {/* Background Animasi */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Gradient Orbs */}
                            <div className="absolute -top-20 -left-20 w-60 h-60 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-linear-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-linear-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-15 animate-bounce"></div>

                            {/* Animated Grid */}
                            <div className="absolute inset-0 opacity-10">
                                <svg
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <pattern
                                            id="grid"
                                            width="50"
                                            height="50"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M 50 0 L 0 0 0 50"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="1"
                                                className="animate-dash"
                                            />
                                        </pattern>
                                    </defs>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        fill="url(#grid)"
                                    />
                                </svg>
                            </div>

                            {/* Floating Particles */}
                            <div className="absolute top-10 left-20 w-3 h-3 bg-white rounded-full opacity-40 animate-float"></div>
                            <div className="absolute top-20 right-32 w-2 h-2 bg-white rounded-full opacity-30 animate-float delay-500"></div>
                            <div className="absolute bottom-16 left-32 w-4 h-4 bg-white rounded-full opacity-50 animate-float delay-1000"></div>
                            <div className="absolute bottom-24 right-16 w-2.5 h-2.5 bg-white rounded-full opacity-40 animate-float delay-1500"></div>
                        </div>

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="bg-white/20 backdrop-blur-2xl p-4 rounded-3xl border border-white/30 shadow-2xl animate-pulse-slow">
                                    <Target className="h-8 w-8 text-white drop-shadow-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-white drop-shadow-2xl bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent animate-gradient">
                                        ✨ Edit Tugas
                                    </h2>
                                    <p className="text-white/80 text-lg mt-2 font-light animate-fade-in">
                                        Perbarui detail tugas Anda dengan
                                        sempurna
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-12 w-12 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-2xl border border-white/30 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-8 max-h-[calc(100vh-280px)] overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-7">
                            <div className="relative">
                                <label className="flex text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-linear-to-b from-violet-500 to-purple-500 rounded-full shadow-md"></div>
                                    Judul Tugas
                                </label>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                    <Input
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="Masukkan judul tugas yang menginspirasi..."
                                        required
                                        className="h-14 rounded-2xl border-2 border-gray-200 focus:border-purple-400 transition-all duration-300 bg-white pl-5 pr-5 text-base font-medium shadow-lg relative"
                                    />
                                </div>
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="flex text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-linear-to-b from-violet-500 to-purple-500 rounded-full shadow-md"></div>
                                    Deskripsi
                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Opsional
                                    </span>
                                </label>
                                <TrixEditor
                                    value={data.description}
                                    onChange={(value) =>
                                        setData("description", value)
                                    }
                                    placeholder="Ceritakan detail tugas Anda dengan gaya..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="flex text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-linear-to-b from-violet-500 to-purple-500 rounded-full shadow-md"></div>
                                    Cover Gambar
                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Opsional
                                    </span>
                                </label>

                                {todoToEdit?.cover_url &&
                                    !data.remove_cover && (
                                        <div className="mb-6">
                                            <div className="relative bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200/50 overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                                                <p className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3 relative">
                                                    <ImageIcon className="h-5 w-5 text-purple-600" />
                                                    Cover Saat Ini
                                                </p>
                                                <div className="flex flex-col items-center gap-4 relative">
                                                    <div className="relative">
                                                        <div className="absolute -inset-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur-md opacity-40"></div>
                                                        <img
                                                            src={
                                                                todoToEdit.cover_url
                                                            }
                                                            alt={
                                                                todoToEdit.title
                                                            }
                                                            className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-2xl relative"
                                                        />
                                                    </div>
                                                    {/* Tombol Hapus dipindah ke bawah gambar */}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-12 px-6 rounded-2xl bg-linear-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 text-red-600 border-2 border-red-300 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Hapus cover gambar ini?"
                                                                )
                                                            ) {
                                                                setData(
                                                                    "cover",
                                                                    null
                                                                );
                                                                setData(
                                                                    "remove_cover",
                                                                    true
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-5 w-5 mr-3" />
                                                        Hapus Cover
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                <label
                                    htmlFor="cover-upload"
                                    className="group cursor-pointer block"
                                >
                                    <div className="relative bg-linear-to-br from-purple-50 via-white to-pink-50 rounded-2xl p-8 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 overflow-hidden hover:shadow-2xl">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                                        <div className="relative flex flex-col items-center justify-center text-center">
                                            <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                                                <ImageIcon className="h-8 w-8 text-white" />
                                            </div>
                                            <p className="font-bold text-gray-700 mb-1 text-lg">
                                                {todoToEdit?.cover_url &&
                                                !data.remove_cover
                                                    ? "Ganti Cover Gambar"
                                                    : "Upload Cover Gambar"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Klik atau drag & drop gambar di
                                                sini
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                PNG, JPG, hingga 5MB
                                            </p>
                                        </div>
                                    </div>
                                </label>
                                <input
                                    id="cover-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setData("cover", e.target.files[0]);
                                        setData("remove_cover", false);
                                    }}
                                />

                                {data.cover && (
                                    <div className="mt-4 p-4 bg-linear-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
                                        <p className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            File terpilih:{" "}
                                            <span className="font-bold">
                                                {data.cover.name}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {errors.cover && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        {errors.cover}
                                    </p>
                                )}
                            </div>

                            {todoToEdit && (
                                <div className="relative">
                                    <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-300 transition-all duration-200 shadow-lg">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                id="is_finished"
                                                className="h-6 w-6 rounded-lg border-2 border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-md"
                                                checked={data.is_finished}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_finished",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                                    Tandai Sebagai Selesai
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Centang jika tugas ini sudah
                                                    diselesaikan
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="h-12 px-8 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 shadow-lg hover:shadow-xl"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 px-10 rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="relative flex items-center gap-2">
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" />
                                                {todoToEdit
                                                    ? "Perbarui Tugas"
                                                    : "Simpan Tugas"}
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    const { auth, todos, stats, filters, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const searchTimeoutRef = useRef(null);

    

 useEffect(() => {
    const normalizedSearch = search ?? "";
    const normalizedStatus = statusFilter ?? "all";

    // Hindari request jika nilai sama dengan filters dari server
    if (
        normalizedSearch === (filters.search ?? "") &&
        normalizedStatus === (filters.status ?? "all")
    ) {
        return;
    }

    clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
        router.get("/", {
            search: normalizedSearch,
            status: normalizedStatus,
        }, {
            preserveState: true,
            replace: true,
            only: ["todos", "stats", "filters", "flash"],
        });
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
}, [search, statusFilter]);








    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
    };

    const chartData = [
        { name: "Selesai", value: stats.finished, color: "#10b981" },
        { name: "Belum Selesai", value: stats.unfinished, color: "#ef4444" },
    ];

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
            <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h1 className="text-5xl font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                    Selamat Datang, {auth.name}! 👋
                                </h1>
                                <p className="text-gray-600 text-xl font-light">
                                    Kelola tugas harianmu dengan mudah dan
                                    efisien.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-0 shadow-2xl rounded-3xl bg-linear-to-br from-emerald-500 to-green-600 text-white overflow-hidden transform hover:scale-105 transition-all duration-500">
                                    <CardContent className="p-8 relative">
                                        <div className="absolute top-6 right-6 opacity-20">
                                            <CheckCircle2 className="h-20 w-20" />
                                        </div>
                                        <div className="text-4xl font-black mb-2">
                                            {stats.finished}
                                        </div>
                                        <p className="text-emerald-100 font-semibold text-lg">
                                            Tugas Selesai
                                        </p>
                                        <div className="w-16 h-1.5 bg-white rounded-full mt-4 opacity-60"></div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-2xl rounded-3xl bg-linear-to-br from-red-500 to-pink-600 text-white overflow-hidden transform hover:scale-105 transition-all duration-500">
                                    <CardContent className="p-8 relative">
                                        <div className="absolute top-6 right-6 opacity-20">
                                            <Clock className="h-20 w-20" />
                                        </div>
                                        <div className="text-4xl font-black mb-2">
                                            {stats.unfinished}
                                        </div>
                                        <p className="text-red-100 font-semibold text-lg">
                                            Belum Selesai
                                        </p>
                                        <div className="w-16 h-1.5 bg-white rounded-full mt-4 opacity-60"></div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="pb-6 border-b border-gray-100">
                                <CardTitle className="text-xl font-black text-gray-800 flex items-center gap-3">
                                    <BarChart3 className="h-6 w-6 text-blue-500" />
                                    Statistik Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
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

                    <Card className="border-0 shadow-2xl rounded-3xl mb-8 bg-white">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                <div className="flex w-full lg:w-auto gap-4 flex-1 max-w-3xl">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 z-10" />
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                            <Input
                                                placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                                                className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white shadow-xl relative"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Filter className="absolute left-4 top-4 h-5 w-5 text-gray-400 z-10" />
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                            <select
                                                className="h-14 rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-8 text-sm shadow-xl focus:border-blue-500 transition-colors appearance-none cursor-pointer relative"
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
                                </div>
                                <Button
                                    onClick={handleAdd}
                                    className="w-full lg:w-auto h-14 px-8 rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-500 shadow-2xl hover:shadow-3xl text-white font-black text-lg transform hover:scale-105"
                                >
                                    <Plus className="mr-3 h-6 w-6" />
                                    Tambah Tugas Baru
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {flash?.success && (
                        <Alert className="mb-8 rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-green-50 text-emerald-800 shadow-2xl">
                            <AlertDescription className="flex items-center gap-3 text-lg font-semibold">
                                <CheckCircle2 className="h-5 w-5" />
                                {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="border-0 shadow-2xl rounded-3xl bg-white overflow-hidden">
                        <CardContent className="p-8">
                            <div className="space-y-6">
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
                                    <div className="text-center py-20 text-gray-500 border-3 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                        <Target className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                                        <p className="text-2xl font-bold mb-3">
                                            {search || statusFilter !== "all"
                                                ? "Tidak ada tugas yang sesuai dengan filter."
                                                : "Belum ada tugas yang ditemukan."}
                                        </p>
                                        <p className="text-lg text-gray-400">
                                            {search || statusFilter !== "all"
                                                ? "Coba ubah pencarian atau filter Anda"
                                                : "Mulai dengan menambahkan tugas pertama Anda!"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {todos.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3">
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
                                            className={`px-5 py-3 text-sm rounded-xl font-bold transition-all duration-300 ${
                                                link.active
                                                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-5 py-3 text-sm text-gray-400 border rounded-xl opacity-50 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}

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
