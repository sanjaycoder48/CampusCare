import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Bookmark
} from "lucide-react";
import { fetchSyllabus } from "../api.js";
import Toast from "../components/Toast.jsx";

const DEPARTMENTS = ["All", "CSE", "IT", "AI&DS", "AIML", "ECE", "EEE", "Mechanical", "Civil"];
const REGULATIONS = ["R2023", "R2021", "R2019"];
const SEMESTERS = ["All", 1, 2, 3, 4, 5, 6, 7, 8];

export default function Syllabus() {
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDept, setSelectedDept] = useState("CSE");
  const [selectedReg, setSelectedReg] = useState("R2023");
  const [selectedSem, setSelectedSem] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchSyllabus().then((data) => {
      if (isMounted) {
        setSyllabusList(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredSyllabus = syllabusList.filter(syl => {
    const matchesDept = selectedDept === "All" || syl.department === selectedDept;
    const matchesReg = selectedReg === "All" || syl.regulation === selectedReg;
    const matchesSem = selectedSem === "All" || syl.semester === Number(selectedSem);
    const matchesSearch =
      (syl.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (syl.code || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesReg && matchesSem && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-950 text-xs font-bold mb-2">
          <Sparkles size={14} /> Material 3 Academic Directory
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Subject Academic Syllabus
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore complete 5-unit curriculum topics, objectives, course outcomes, and textbook reference catalogs.
        </p>
      </div>

      {/* M3 Department Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Department:</span>
        {DEPARTMENTS.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`m3-chip ${
              selectedDept === dept
                ? "bg-sky-600 text-white shadow-xs font-bold"
                : "m3-chip-filter"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m3-card p-4">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code or subject title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full m3-search-bar"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Regulation:</span>
          <select
            value={selectedReg}
            onChange={e => setSelectedReg(e.target.value)}
            className="w-full p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800"
          >
            {REGULATIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Semester:</span>
          <select
            value={selectedSem}
            onChange={e => setSelectedSem(e.target.value)}
            className="w-full p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800"
          >
            {SEMESTERS.map(s => <option key={s} value={s}>{s === "All" ? "All Semesters" : `Semester ${s}`}</option>)}
          </select>
        </div>
      </div>

      {/* Course Accordion List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">Loading syllabus catalog...</div>
      ) : filteredSyllabus.length === 0 ? (
        <div className="py-16 text-center m3-card p-8 space-y-2">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Syllabus Records Found</h3>
          <p className="text-sm text-slate-400">Try adjusting your regulation or semester filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSyllabus.map(syl => {
            const isExpanded = expandedCourseId === syl.id;

            return (
              <div
                key={syl.id}
                className="m3-card overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedCourseId(isExpanded ? null : syl.id)}
                  className="p-6 cursor-pointer hover:bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
                      {syl.code}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{syl.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-bold text-sky-700">{syl.department} Dept</span>
                        <span>•</span>
                        <span>{syl.regulation} Regulation</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">Semester {syl.semester}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold">{syl.credits} Credits</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast("info", `Downloading PDF syllabus for ${syl.code}...`);
                      }}
                      className="p-2 text-slate-400 hover:text-sky-600 rounded-full hover:bg-sky-50 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 pt-2 border-t border-slate-100 space-y-6 bg-slate-50/50">
                    {/* Objectives */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-sky-600" /> Course Objectives
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                        {(syl.objectives || []).map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    </div>

                    {/* 5 Units */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">5-Unit Syllabus Breakup</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {(syl.units || []).map(unit => (
                          <div key={unit.unitNumber} className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                            <h5 className="font-bold text-xs text-slate-900">Unit {unit.unitNumber}: {unit.title}</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">{unit.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Textbooks & References */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                        <h5 className="font-bold text-slate-900">Prescribed Textbooks</h5>
                        <ul className="list-disc list-inside text-slate-600 space-y-1">
                          {(syl.textbooks || []).map((tb, i) => <li key={i}>{tb}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                        <h5 className="font-bold text-slate-900">Reference Materials</h5>
                        <ul className="list-disc list-inside text-slate-600 space-y-1">
                          {(syl.referenceBooks || []).map((rb, i) => <li key={i}>{rb}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
