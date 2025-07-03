// 관리자 페이지 전체 코드 (리팩토링 완료)
import { useEffect, useState } from "react";
import axios from "axios";

const JOBS = ["🛡️전사", "🗡️도적", "🌀주술사", "🙏도사"];

interface Member {
  id: string;
  number: number;
  name: string;
  job: string;
  hp: number | null;
  mp: number | null;
  days: string | null;
  imageUrl: string | null;
  message: string | null;
  lastUpdated: string;
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({
    number: "1",
    name: "",
    job: "",
    hp: "0",
    mp: "0",
    message: "",
  });

  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchNotice();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get("/api/getMembers");
    setMembers(res.data);

    // 자동 넘버 계산
    const used = res.data.map((m: Member) => m.number).sort((a: number, b: number) => a - b);
    let next = 1;
    for (let i = 0; i < used.length; i++) {
      if (used[i] !== next) break;
      next++;
    }
    setForm((prev) => ({ ...prev, number: next.toString() }));
  };

  const fetchNotice = async () => {
    const res = await axios.get("/api/getNotice");
    setNotice(res.data);
  };

  const handleAdd = async () => {
    if (!form.name || !form.job) {
      alert("이름과 직업은 필수입니다.");
      return;
    }

    await axios.post("/api/addMember", {
      ...form,
      number: parseInt(form.number),
      hp: parseInt(form.hp),
      mp: parseInt(form.mp),
    });

    setForm({ number: "", name: "", job: "", hp: "0", mp: "0", message: "" });
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await axios.post("/api/deleteMember", { id });
    fetchMembers();
  };

  const handleCopy = (id: string) => {
    const url = `${location.origin}/u/${id}`;
    navigator.clipboard.writeText(url);
    alert("링크가 복사되었습니다:\n" + url);
  };

  const handleNoticeSave = async () => {
    await axios.post("/api/saveNotice", { text: notice });
    alert("공지사항이 저장되었습니다.");
  };

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto text-[15px]">
        <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">문파원 추가</h1>

        {/* 등록 폼 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "No", key: "number", type: "number" },
            { label: "이름", key: "name", type: "text" },
            { label: "직업", key: "job", type: "select" },
            { label: "체력", key: "hp", type: "number" },
            { label: "마력", key: "mp", type: "number" },
            { label: "할말", key: "message", type: "text" },
          ].map(({ label, key, type }) => (
            <label key={key} className="flex flex-col">
              {label}
              {type === "select" ? (
                <select
                  className="bg-[#3a3a3a] border border-[#555] px-3 py-2 mt-1 rounded"
                  value={form.job}
                  onChange={(e) => setForm({ ...form, job: e.target.value })}
                >
                  <option value="">--선택--</option>
                  {JOBS.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  className="bg-[#3a3a3a] border border-[#555] px-3 py-2 mt-1 rounded"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </label>
          ))}
          <button
            className="bg-[#e53935] text-white py-2 px-4 rounded hover:bg-red-600 mt-auto"
            onClick={handleAdd}
          >
            ➕ 추가
          </button>
        </div>

        {/* 공지사항 */}
        <h2 className="text-xl font-bold text-red-500 mt-10 mb-2 text-center">상시 공지사항</h2>
        <div className="flex gap-2 max-w-xl mx-auto mb-10">
          <input
            className="flex-1 bg-[#3a3a3a] border border-[#555] px-3 py-2 rounded"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
          <button
            className="bg-[#e53935] px-4 py-2 rounded hover:bg-red-600"
            onClick={handleNoticeSave}
          >
            수정
          </button>
        </div>

        {/* 리스트 */}
        <h2 className="text-xl font-bold text-red-500 mb-4 text-center">문파원 리스트</h2>
        <div className="overflow-auto text-sm">
          <table className="w-full border-collapse border border-[#555] text-center">
            <thead className="bg-[#e53935] text-white text-sm">
              <tr>
                {["번호", "이름", "직업", "체력", "마력", "점수", "요일", "이미지", "할말", "수정일", "링크", "관리"].map((th) => (
                  <th key={th} className="px-4 py-3 border border-[#555]">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const score = (m.hp ?? 0) + (m.mp ?? 0) * 2;
                const days = m.days ? m.days.split(",").join(", ") : "-";
                return (
                  <tr key={m.id} className="bg-[#2e2e2e] border-t border-[#555] align-middle">
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{m.number}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{m.name}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{m.job}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{m.hp ?? "-"}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{m.mp ?? "-"}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap text-red-400 font-semibold">
                      {score.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">{days}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">
                      {m.imageUrl ? (
                        <img
                          src={m.imageUrl}
                          onClick={() => {
                            if (m.imageUrl) window.open(m.imageUrl, "_blank");
                          }}

                          className="w-10 h-10 object-cover border border-gray-500 rounded cursor-pointer hover:opacity-80"
                        />
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3 border border-[#555]">{m.message ?? "-"}</td>
                    <td className="px-4 py-3 border border-[#555]">{new Date(m.lastUpdated).toLocaleString()}</td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">
                      <button
                        className="text-sm px-2 py-1 bg-[#e53935] text-white rounded hover:bg-red-600"
                        onClick={() => handleCopy(m.id)}
                      >
                        복사
                      </button>
                    </td>
                    <td className="px-4 py-3 border border-[#555] whitespace-nowrap">
                      <button
                        className="text-sm px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        onClick={() => handleDelete(m.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
