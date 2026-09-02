export default function DevQuickstart() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">⚡ API 빠른 시작</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">5분 만에 AI API를 사용하는 방법</p>
      </div>

      {/* What is API */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">API가 뭔가요? 🔌</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          API는 <strong>Application Programming Interface</strong>의 약자로, 내 코드에서 AI 모델의 기능을 호출할 수 있는 창구예요.
          ChatGPT 웹에서 질문하는 대신, 코드로 자동화할 수 있어요.
        </p>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">시작하기</h2>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">API 키 발급받기</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            AI 제공사에서 회원가입 후 API 키를 발급받으세요. OpenRouter는 500개 이상 모델을 하나의 키로 쓸 수 있어서 추천해요.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100">
              OpenRouter (추천) →
            </a>
            <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-200">
              OpenAI →
            </a>
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-200">
              Google AI Studio →
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">코드 작성하기</h3>
          </div>

          {/* Python */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">🐍 Python</p>
            <pre className="text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-gray-700 dark:text-gray-300 leading-relaxed">
{`import openai

client = openai.OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
  model="deepseek/deepseek-v3.2",
  messages=[
    {"role": "user", "content": "안녕! AI에 대해 설명해줘"}
  ]
)

print(response.choices[0].message.content)`}
            </pre>
          </div>

          {/* JavaScript */}
          <div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">🟨 JavaScript / TypeScript</p>
            <pre className="text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-gray-700 dark:text-gray-300 leading-relaxed">
{`const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-v3.2",
      messages: [
        { role: "user", content: "안녕! AI에 대해 설명해줘" }
      ],
    }),
  }
);

const data = await response.json();
console.log(data.choices[0].message.content);`}
            </pre>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">결과 확인하기</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            코드를 실행하면 AI의 답변이 JSON 형식으로 돌아와요. <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">choices[0].message.content</code> 에 답변이 들어있어요.
            이걸 내 앱에 표시하거나, 데이터베이스에 저장하거나, 다음 작업에 활용할 수 있어요.
          </p>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900 p-6">
        <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3">💡 팁</h2>
        <ul className="space-y-2 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          <li>• <strong>API 키는 절대 공개하지 마세요.</strong> GitHub에 올리면 누군가 내 계정으로 API를 호출할 수 있어요.</li>
          <li>• <strong>.env 파일에 저장</strong>하고 코드에서는 <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900/40 rounded">process.env.API_KEY</code>로 불러오세요.</li>
          <li>• <strong>스트리밍을 사용하면</strong> 답변이 생성되는 즉시 표시할 수 있어서 UX가 훨씬 좋아져요.</li>
          <li>• <strong>처음엔 저렴한 모델</strong>(DeepSeek-V3.2, Gemini 2.5 Flash)로 테스트하고, 만족하면 고급 모델로 전환하세요.</li>
        </ul>
      </section>
    </div>
  );
}
