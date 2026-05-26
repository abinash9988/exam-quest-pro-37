import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import { student, categories } from "@/lib/studentMock";
import { toast } from "sonner";

export function EditProfileSheet() {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [mobile, setMobile] = useState(student.mobile);
  const [pref, setPref] = useState(student.preferredCategoryId);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    toast.success("Profile updated", { description: "Mock save — connect a backend to persist." });
  };

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" /> Edit profile
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--gradient-hero)] text-base font-bold text-primary-foreground">
                  {student.avatar}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-border bg-background shadow-[var(--shadow-soft)]"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
            </div>
            <div className="text-xs text-muted-foreground">PNG/JPG up to 2MB</div>
          </div>

          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Preferred exam</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((c) => {
                const active = pref === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setPref(c.id)}
                    className={`rounded-xl border p-2 text-left text-xs transition ${
                      active ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="text-lg">{c.icon}</div>
                    <div className="font-bold">{c.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button className="w-full" onClick={handleSave}>Save changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
