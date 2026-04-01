/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PlusCircle, Loader2, Briefcase, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import toast from "react-hot-toast";
import { TProject } from "@/types";
import ProjectFormModal from "./ProjectFormModal";
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/redux/api/productApi";
import Image from "next/image";

const statusStyle: Record<string, string> = {
  Live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Completed: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "In Development": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "On Hold": "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<TProject | null>(null);

  const { data: projects, refetch, isLoading } = useGetAllProjectsQuery({});
  // const projects: TProject[] = projectsData?.data ?? [];

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handleOpenCreate = () => { setEditingProject(null); setIsModalOpen(true); };
  const handleOpenEdit = (project: TProject) => { setEditingProject(project); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingProject(null); };

  const handleSave = async (data: Partial<TProject>) => {
    const payload = { ...data };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    try {
      if (editingProject?._id) {
        await updateProject({ id: editingProject._id, data: payload }).unwrap();
        toast.success("Project updated!");
      } else {
        await createProject(payload).unwrap();
        toast.success("Project created!");
      }
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to save project.");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject([projectId]).unwrap();
      toast.success("Project deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete project.");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Briefcase className="w-5 h-5 text-teal-400" />
            </div>
            Projects
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/30"
        >
          <PlusCircle size={16} />
          Add Project
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
        {projects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-teal-400" />
            </div>
            <p className="text-slate-300 font-medium">No projects yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Project</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Date</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Links</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {projects.map((project: TProject) => (
                  <tr key={project._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {project.image ? (
                          <Image src={project.image} alt={project.title} width={56} height={40}
                            className="w-14 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                            <Briefcase size={14} className="text-slate-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-200">{project.title}</p>
                          {project.technologies?.slice(0, 3).length > 0 && (
                            <p className="text-xs text-slate-600 mt-0.5">{project.technologies.slice(0, 3).join(", ")}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle[project.status ?? ""] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                        {project.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{project.category}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(project.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors" title="Live site">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {project.githubClient && (
                          <a href={project.githubClient} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Client repo">
                            <Github size={14} />
                          </a>
                        )}
                        {project.githubServer && (
                          <a href={project.githubServer} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors" title="Server repo">
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => project._id && handleOpenEdit(project) && refetch()}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => project._id && handleDelete(project._id)} disabled={isDeleting}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectFormModal
        isLoading={isCreating || isUpdating || isDeleting}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;
