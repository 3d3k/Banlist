// 封禁数据（可根据实际情况扩展）
const banData = {
  tban: [ // 临时封禁
    {
      uuid: "5dc54b2d-ed3e-31ea-a6fa-c29ae68f3b37",
      name: "gay",
      created: "2026-04-25 19:40:40 +0800",
      banid: "3D3K-TBAN-20260425",
      expires: "2026-04-26 15:40:40 +0800",
      reason: "§6§l[3d3k 1.21.11] §c§l使用违规药水，证据确凿 §e§l封禁1天 §6§l如需申诉请查看 https://3d3k.discourse.group/t/topic/112"
    },
    {
      uuid: "133348c0-fa93-39d2-8e5a-5779cd6691af",
      name: "xiaoxiongw",
      created: "2026-04-25 07:49:48 +0800",
      banid: "3D3K-KBAN-20260425",
      expires: "2026-04-30 07:49:48 +0800",
      reason: "§6§l[3d3k 1.21.11] §c§l恶意卡服，证据确凿 §e§l封禁7天 §6§l如需申诉请查看 https://3d3k.discourse.group/t/topic/98"
    }
  ],
  fban: [ // 永久封禁（示例）
    {
      uuid: "example-fban-uuid-123",
      name: "example_hacker",
      created: "2026-01-01 00:00:00 +0800",
      banid: "3D3K-FBAN-20260101",
      reason: "§4§l永久封禁：大规模使用外挂毁服"
    }
  ]
};

// 处理请求
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    // 1. 如果有查询参数，直接返回 JSON 结果
    if (query) {
      const result = searchBan(query.trim());
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 2. 没有查询参数，返回 Web 查询界面
    return new Response(htmlPage, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

// 查询逻辑
function searchBan(query) {
  // 遍历临时封禁
  for (const ban of banData.tban) {
    if ([ban.name, ban.banid, ban.uuid].includes(query)) {
      return { success: true, type: "tban", data: ban };
    }
  }

  // 遍历永久封禁
  for (const ban of banData.fban) {
    if ([ban.name, ban.banid, ban.uuid].includes(query)) {
      return { success: true, type: "fban", data: ban };
    }
  }

  // 未找到
  return { success: false, message: "未找到匹配的封禁记录" };
}

// Web 界面 HTML
const htmlPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>3d3k 封禁查询</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 0 20px; }
    h1 { color: #333; text-align: center; }
    .search-box { display: flex; gap: 10px; margin-bottom: 20px; }
    input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
    button { padding: 12px 24px; background: #0070f3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
    button:hover { background: #005bb5; }
    .result { padding: 15px; border-radius: 6px; background: #f5f5f5; white-space: pre-wrap; word-break: break-all; }
    .error { color: #dc2626; }
    .success { color: #16a34a; }
  </style>
</head>
<body>
  <h1>3d3k 封禁查询</h1>
  <div class="search-box">
    <input type="text" id="query" placeholder="输入用户名 / 封禁编号 / UUID">
    <button onclick="search()">查询</button>
  </div>
  <div id="result" class="result" style="display: none;"></div>

  <script>
    async function search() {
      const query = document.getElementById('query').value.trim();
      const resultDiv = document.getElementById('result');
      
      if (!query) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result error';
        resultDiv.textContent = '请输入查询内容';
        return;
      }

      try {
        const response = await fetch(\`?q=\${encodeURIComponent(query)}\`);
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        if (data.success) {
          resultDiv.className = 'result success';
          resultDiv.textContent = JSON.stringify(data, null, 2);
        } else {
          resultDiv.className = 'result error';
          resultDiv.textContent = data.message;
        }
      } catch (err) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result error';
        resultDiv.textContent = '查询失败：' + err.message;
      }
    }

    // 支持回车查询
    document.getElementById('query').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') search();
    });
  </script>
</body>
</html>
`;
