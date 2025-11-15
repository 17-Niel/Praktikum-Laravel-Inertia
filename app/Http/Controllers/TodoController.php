<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Menampilkan daftar todo (beranda).
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Memanggil relasi todos() yang harus sudah didefinisikan di model User
        $query = $user->todos()->latest();

        // Fitur Pencarian
        if ($request->has('search') && !empty($request->search)) {
        $searchTerm = $request->search;
        $query->where(function($q) use ($searchTerm) {
            $q->where('title', 'ilike', '%' . $searchTerm . '%')
            ->orWhere('description', 'ilike', '%' . $searchTerm . '%');
        });
}

        // Fitur Filter Status
        if ($request->has('status') && $request->status !== 'all') {
            // 'finished' (true) atau 'unfinished' (false)
            $query->where('is_finished', $request->status === 'finished'); 
        }

        // Pagination 20 item per halaman
        $todos = $query->paginate(20)->withQueryString();

        // Menambahkan URL cover ke setiap item todo
        $todos->getCollection()->transform(function ($todo) {
            $todo->cover_url = $todo->cover 
                ? Storage::disk('public')->url($todo->cover) 
                : null;
            return $todo;
        });

        // Statistik untuk Diagram Bulat
        $stats = [
            'finished' => $user->todos()->where('is_finished', true)->count(),
            'unfinished' => $user->todos()->where('is_finished', false)->count(),
        ];

        return inertia('app/HomePage', [ 
            'auth' => ['name' => $user->name],
            'todos' => $todos,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menyimpan todo baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('title', 'description');
        $data['user_id'] = Auth::id();
        $data['is_finished'] = false;

        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        Todo::create($data);

        return redirect()->back()->with('success', 'Todo berhasil ditambahkan.');
    }

    /**
     * Memperbarui todo.
     */
    public function update(Request $request, Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) abort(403);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_finished' => 'boolean',
            'cover' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('title', 'description', 'is_finished');
        
        if ($request->has('remove_cover') && $request->remove_cover) {
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }
            $data['cover'] = null;
        }
        else if ($request->hasFile('cover')) {
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        $todo->update($data);

        return redirect()->back()->with('success', 'Todo berhasil diperbarui.');
    }

    /**
     * Menghapus todo.
     */
    public function destroy(Request $request, Todo $todo)
    {
        // Otorisasi
        if ($todo->user_id !== Auth::id()) abort(403);

        // Simpan parameter pagination sebelum menghapus
        $currentPage = $request->get('page', 1);
        $search = $request->get('search');
        $status = $request->get('status', 'all');

        // Hapus file cover dari storage
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        // Hitung total item setelah penghapusan
        $user = Auth::user();
        $query = $user->todos()->latest();

        // Terapkan filter yang sama seperti di index()
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'ilike', '%' . $search . '%')
                  ->orWhere('description', 'ilike', '%' . $search . '%');
            });
        }

        if ($status !== 'all') {
            $query->where('is_finished', $status === 'finished');
        }

        $totalItems = $query->count();
        $perPage = 20;
        $totalPages = ceil($totalItems / $perPage);

        // Jika halaman current lebih besar dari total halaman yang tersedia,
        // dan total halaman > 0, redirect ke halaman sebelumnya
        if ($currentPage > $totalPages && $totalPages > 0) {
            $currentPage = $totalPages;
        }

        // Jika tidak ada item sama sekali, tetap di halaman 1
        if ($totalPages === 0) {
            $currentPage = 1;
        }

        return redirect()->route('home', [
            'page' => $currentPage,
            'search' => $search,
            'status' => $status
        ])->with('success', 'Todo berhasil dihapus.');
    }
}