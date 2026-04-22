import { AdminEnvNotice } from "@/components/admin/AdminEnvNotice";

interface AdminSupabaseConnectionNoticeProps {
  description?: string;
}

export function AdminSupabaseConnectionNotice({
  description = "当前部署已经注入后台变量，但运行时连接 Supabase 数据服务失败，所以这个后台页面暂时无法读取实时数据。前台访问不受影响。"
}: AdminSupabaseConnectionNoticeProps) {
  return (
    <AdminEnvNotice
      title="后台数据服务暂时不可用"
      description={description}
      detailTitle="建议检查："
      detailItems={[
        "`NEXT_PUBLIC_SUPABASE_URL` 是否指向当前仍然有效的 Supabase 项目",
        "Vercel 生产环境能否正确解析并访问该 Supabase 域名",
        "如果近期迁移过数据库，请同步更新 production 和 preview 环境变量"
      ]}
    />
  );
}

export default AdminSupabaseConnectionNotice;
