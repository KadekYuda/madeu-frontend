"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  Plus,
  Trash2,
  Search,
  GraduationCap,
  Mail,
  Info,
} from "lucide-react";
import api from "@/lib/axios";
import {
  CreateModal,
  EditModal,
  TeacherDetailModal,
} from "@/app/dashboard/components/modals";
import Pagination from "@/app/dashboard/components/pagination";
import PerPageSelect from "@/app/dashboard/components/SelectPerPage";
import InstrumenIcon from "@/app/dashboard/components/InstrumenIcon";
import { AxiosError } from "axios";

interface Teacher extends Record<string, unknown> {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  image?: string;
  instrument_ids?: number[];
  teacher_profile?: {
    user_uuid: string;
    bio: string;
    instruments: Array<{ id: number; name: string }>;
  };
}

interface Instrument {
  id: number;
  name: string;
}

const GridContent = ({
  isLoading,
  error,
  filteredTeachers,
  openEditModal,
  openDetailModal,
  currentPage,
  itemsPerPage,
}: {
  isLoading: boolean;
  error: string | null;
  filteredTeachers: Teacher[];
  openEditModal: (teacher: Teacher) => void;
  openDetailModal: (teacher: Teacher) => void;
  currentPage: number;
  itemsPerPage: number;
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">
          Memuat data teacher...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
          <Info className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-lg font-bold text-gray-900">{error}</p>
        <p className="text-sm text-gray-500 mt-1">
          Silakan coba muat ulang halaman
        </p>
      </div>
    );
  }

  if (filteredTeachers.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
          <GraduationCap className="w-10 h-10 text-purple-400" />
        </div>
        <p className="text-lg font-bold text-gray-900">
          Tidak ada teacher ditemukan
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Coba kata kunci lain atau tambahkan teacher baru
        </p>
      </div>
    );
  }

  return (
    <>
      {filteredTeachers.map((teacher, index) => (
        <div
          key={teacher.uuid}
          onClick={() => openDetailModal(teacher)}
          className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
        >
          {/* Background Gradient Accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-3 right-1 z-20 flex gap-2">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(teacher);
              }}
              className="p-1.5 bg-white/80 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-gray-400 hover:text-blue-600 shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Edit Teacher"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Number Badge */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm z-20 group-hover:text-white group-hover:bg-purple-600">
            {currentPage * itemsPerPage + index + 1}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex gap-4">
              {/* Left: Icon or Image */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  {teacher.image || process.env.NEXT_PUBLIC_DEFAULT_AVATAR ? (
                    <img
                      src={teacher.image || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>

              {/* Right: Info Header */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-purple-700 transition-colors mb-1">
                  {teacher.name}
                </h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  {teacher.teacher_profile?.instruments && teacher.teacher_profile.instruments.length > 0 && (
                  <div className="flex items-center gap-1 lg:gap-1.5">
                    {teacher.teacher_profile.instruments.slice(0, 2).map((inst) => (
                      <div
                        key={inst.id}
                        className="flex items-center gap-1 lg:gap-1.5 px-2 py-1 lg:px-3 lg:py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-300 text-[10px] md:text-xs font-semibold hover:from-blue-100 hover:to-indigo-100 transition"
                      >
                        <InstrumenIcon
                          instrumentName={inst.name}
                          className="w-3 h-3 md:w-3.5 md:h-3.5"
                        />
                        <span className="capitalize">
                          {inst.name}
                        </span>
                      </div>
                    ))}
                    {teacher.teacher_profile.instruments.length > 2 && (
                      <span className="text-xs text-gray-500 font-semibold invisible sm:visible">...</span>
                    )}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch all teachers and instruments
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teachersRes, instrumentsRes] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/admin/instruments"),
      ]);
      setTeachers(teachersRes.data?.data || []);
      setInstruments(instrumentsRes.data?.data || []);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as AxiosError<{ message: string }>;
      if (error.isAxiosError && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Gagal memuat data teacher");
      }
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create teacher
  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      setCreateError(null);
      const response = await api.post("/admin/teachers", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        image: data.image,
        bio: data.bio,
        instrument_ids: data.instrument_ids,
      });
      await fetchData();
      setIsCreateOpen(false);
      setCreateError(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as AxiosError<{ message: string }>;
      const message = (error.isAxiosError && error.response?.data?.message) || "Gagal membuat teacher";
      setCreateError(message);
      throw new Error(message);
    }
  };

  // Update teacher
  const handleUpdate = async (data: Record<string, unknown>) => {
    try {
      setEditError(null);
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        instrument_ids: data.instrument_ids,
      };
      
      // Only include image if a new one was uploaded
      if (data.image) {
        payload.image = data.image;
      }
      
      console.log("Update payload:", payload);
      const response = await api.put(`/admin/teachers/modify/${selectedTeacher?.uuid}`, payload);
      console.log("Update response:", response.data);
      
      // Update the teachers list with the new data
      // Refresh data to ensure we have the latest state including relations
      await fetchData();
      setIsEditOpen(false);
      setEditError(null);
      setSelectedTeacher(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as AxiosError<{ message: string }>;
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      const message = (error.isAxiosError && error.response?.data?.message) || "Gagal update teacher";
      setEditError(message);
      throw new Error(message);
    }
  };


  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const createFields = [
    {
      name: "name",
      label: "Nama",
      type: "text",
      required: true,
      placeholder: "Masukkan nama teacher",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Masukkan email",
    },
    {
      name: "phone",
      label: "Nomor HP",
      type: "tel",
      required: true,
      placeholder: "Masukkan nomor HP",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Masukkan password",
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      required: false,
      placeholder: "Masukkan bio teacher",
    },
    {
      name: "instrument_ids",
      label: "Instrumen",
      type: "select",
      required: true,
      isMulti: true,
      options: instruments.map((inst) => ({
        value: inst.id,
        label: inst.name,
      })),
    },
    {
      name: "image",
      label: "Foto Profil",
      type: "file",
    },
  ];

  const editFields = [
    {
      name: "name",
      label: "Nama",
      type: "text",
      required: true,
      placeholder: "Masukkan nama teacher",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Masukkan email",
    },
    {
      name: "phone",
      label: "Nomor HP",
      type: "tel",
      required: true,
      placeholder: "Masukkan nomor HP",
    },
    {
      name: "bio",
      label: "Bio",
      type: "textarea",
      required: false,
      placeholder: "Masukkan bio teacher",
    },
    {
      name: "instrument_ids",
      label: "Instrumen",
      type: "select",
      required: true,
      isMulti: true,
      options: instruments.map((inst) => ({
        value: inst.id,
        label: inst.name,
      })),
    },
    {
      name: "image",
      label: "Foto Profil",
      type: "file",
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800 font-inter">
      <main className="max-w-7xl mx-auto px-2 space-y-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Icon */}
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg flex-shrink-0">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
                Kelola Teacher
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mt-1">
                Kelola data teacher dan spesialisasi instrumen
              </p>
            </div>

             {/* Add Button */}
             <button
              onClick={() => {
                setSelectedTeacher(null);
                setCreateError(null);
                setIsCreateOpen(true);
              }}
              className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah Teacher
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-sky-500 rounded-2xl p-3 shadow-2xl relative overflow-hidden mt-4">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full"></div>
            <div className="absolute right-4 top-4 w-20 h-20 bg-sky-400/10 rounded-full"></div>

            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white/90 mb-2 tracking-wider uppercase">
                  Total Teacher
                </p>
                <div className="flex items-center">
                  <p className="text-3xl font-black text-white drop-shadow-md">
                    {teachers.length}
                  </p>
                  <span className="ml-2 text-sm sm:text-base md:text-2xl text-white/80">
                    orang
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-8 border border-gray-300 rounded-t-3xl bg-gradient-to-r from-gray-50 to-gray-100/50">
            <div className="space-y-5">
              {/* Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    Daftar Teacher
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {filteredTeachers.length} teacher ditemukan
                  </p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition duration-200 shadow-sm placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tampilkan:
                  </label>
                  <PerPageSelect
                    value={itemsPerPage}
                    onChange={(val) => {
                      setItemsPerPage(val);
                      setCurrentPage(0);
                    }}
                    options={[4, 8, 20, 100]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <GridContent
                isLoading={loading}
                error={error}
                filteredTeachers={paginatedTeachers}
                openEditModal={(teacher) => {
                  console.log("Teacher data:", teacher);
                  
                  // Extract instruments from teacher_profile
                  const instruments = teacher.teacher_profile?.instruments || [];
                  console.log("Teacher instruments:", instruments);
                  
                  // Prepare teacher data with instrument_ids extracted from teacher_profile.instruments
                  const instrumentIds = instruments.map((inst) => inst.id) || [];
                  console.log("Extracted instrument_ids:", instrumentIds);
                  
                  const teacherData: Teacher = {
                    ...teacher,
                    instrument_ids: instrumentIds,
                    bio: teacher.teacher_profile?.bio || "",
                  };
                  console.log("Final teacher data for edit:", teacherData);
                  
                  setSelectedTeacher(teacherData);
                  setEditError(null);
                  setIsEditOpen(true);
                }}
                openDetailModal={(teacher) => {
                  setSelectedTeacher(teacher);
                  setIsDetailOpen(true);
                }}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
              />
            </div>

           {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-2 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredTeachers.length}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateModal<Record<string, unknown>>
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateError(null);
        }}
        onSubmit={handleCreate}
        title="Tambah Teacher Baru"
        fields={createFields}
        error={createError}
      />

      <EditModal<Record<string, unknown>>
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditError(null);
          setSelectedTeacher(null);
        }}
        onSubmit={handleUpdate}
        title="Edit Teacher"
        initialData={selectedTeacher || ({} as Record<string, unknown>)}
        fields={editFields}
        error={editError}
      />

      <TeacherDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTeacher(null);
        }}
        teacherDetail={selectedTeacher}
      />
    </div>
  );
}
