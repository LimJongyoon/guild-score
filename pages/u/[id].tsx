import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const DAYS = ["화", "수", "목", "금"];

export default function UserTablePage() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState("");
  const [member, setMember] = useState<any>(null);
  const [form, setForm] = useState({
    hp: "0",
    mp: "0",
    message: "",
    days: [] as string[],
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;

    axios.get("/api/getNotice").then((res) => setNotice(res.data));

    axios.get("/api/getMemberById", { params: { id } }).then((res) => {
      const m = res.data;
      setMember(m);
      setForm({
        hp: m.hp?.toString() || "0",
        mp: m.mp?.toString() || "0",
        message: m.message || "",
        days: m.days?.split(",") || [],
        imageUrl: m.imageUrl || "",
      });
    });
  }, [id]);

  const score = parseInt(form.hp || "0") + parseInt(form.mp || "0") * 2;

  const updateField = async (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (!id) return;

    if (field === "hp" || field === "mp") {
      await axios.post("/api/updateStats", {
        id,
        hp: field === "hp" ? value : form.hp,
        mp: field === "mp" ? value : form.mp,
      });
    } else if (field === "message") {
      await axios.post("/api/updateMessage", { id, message: value });
    }
  };

  const toggleDay = (day: string) => {
    const updated = form.days.includes(day)
      ? form.days.filter((d) => d !== day)
      : [...form.days, day];
    setForm((prev) => ({ ...prev, days: updated }));
    axios.post("/api/updateDays", { id, days: updated.join(",") });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id as string);

    const res = await axios.post("/api/uploadImage", formData);
    setForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
  };

  if (!member) return <div className="text-white p-4">로딩 중...</div>;

return (
  <div className="bg-[#1e1e1e] text-white min-h-screen px-4 py-8 max-w-6xl mx-auto text-[15px]">
    {/* 공지사항 */}
    <div className="bg-[#e53935] text-white text-sm px-4 py-2 rounded mb-6 font-semibold">
      📢 {notice}
    </div>

    {/* 테이블 */}
    <table className="w-full border-collapse border border-[#555] text-center">
      <thead className="bg-[#e53935] text-white text-sm">
        <tr>
          {["NO", "이름", "직업", "체력", "마력", "공성점수", "이미지", "참여가능 요일", "할말"].map((label) => (
            <th key={label} className="px-4 py-3 border border-[#555]">{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="bg-[#2e2e2e] border-t border-[#555] align-middle">
          <td className="px-4 py-3 border border-[#555]">{member.number}</td>
          <td className="px-4 py-3 border border-[#555]">{member.name}</td>
          <td className="px-4 py-3 border border-[#555]">{member.job}</td>

          {/* 체력 */}
          <td className="px-4 py-3 border border-[#555]">
            <input
              type="number"
              value={form.hp}
              onChange={(e) => updateField("hp", e.target.value)}
              className="w-28 text-center bg-[#3a3a3a] border border-[#555] rounded px-2 py-1"
            />
          </td>

          {/* 마력 */}
          <td className="px-4 py-3 border border-[#555]">
            <input
              type="number"
              value={form.mp}
              onChange={(e) => updateField("mp", e.target.value)}
              className="w-28 text-center bg-[#3a3a3a] border border-[#555] rounded px-2 py-1"
            />
          </td>

          {/* 점수 */}
          <td className="px-4 py-3 border border-[#555] text-red-400 font-bold">
            {score.toLocaleString()}
          </td>

          {/* 이미지 */}
          <td className="px-4 py-3 border border-[#555]">
            <div className="flex items-center gap-2 justify-center">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  onClick={() => window.open(form.imageUrl, "_blank")}
                  className="w-10 h-10 object-cover border border-gray-500 rounded cursor-pointer hover:opacity-80"
                />
              )}
              <label className="bg-[#e53935] text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-600">
                업로드
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>
          </td>

          {/* 요일 버튼 */}
          <td className="px-4 py-3 border border-[#555]">
            <div className="flex gap-1 justify-center">
              {DAYS.map((day) => {
                const selected = form.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      selected
                        ? "bg-[#e53935] text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </td>

          {/* 할말 */}
          <td className="px-4 py-3 border border-[#555]">
            <input
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              onBlur={() => updateField("message", form.message)}
              className="w-full bg-[#3a3a3a] text-white border border-[#555] rounded px-2 py-1"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

}
