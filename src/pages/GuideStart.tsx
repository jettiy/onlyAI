import { koreanServices, CATEGORY_COLORS } from '../data/koreanServices';

export default function GuideStart() {
  const categories = [...new Set(koreanServices.map(s => s.category))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">🚀 AI 처음이에요</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI가 처음이신 분들을 위한 친절한 안내서</p>
      </div>

      {/* What is AI */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">AI가 뭔가요? 🤔</h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            <strong>AI (인공지능)</strong>은 컴퓨터가 사람처럼 생각하고 학습하는 기술이에요.
            요즘 말하는 AI는 주로 <strong>대규모 언어 모델(LLM)</strong>을 의미해요.
          </p>
          <p>
            쉽게 말하면, 엄청나게 많은 글을 읽고 배운 AI가 여러분의 질문에 답변하고,
            글을 쓰고, 코드를 작성하는 거예요.
          </p>
          <p>
            ChatGPT, 클로드,Gemini 같은 서비스가 바로 이 기술을 사용하고 있어요.
          </p>
        </div>
      </section>

      {/* How to start */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">어떻게 시작하나요? 🏁</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'AI 채팅 서비스를 사용해보세요', desc: '뤼튼, AskUp 같은 한국어 서비스로 가볍게 시작할 수 있어요.' },
            { step: 2, title: '프롬프트 작성법을 배우세요', desc: 'AI에게 질문하는 방법만 알면 훨씬 좋은 결과를 얻을 수 있어요.' },
            { step: 3, title: 'API로 직접 연동해보세요', desc: '개발자라면 API를 써서 내 앱에 AI를 붙일 수 있어요.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Korean AI Services */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🇰🇷 한국에서 바로 쓸 수 있는 AI 서비스</h2>
        {categories.map(cat => {
          const catInfo = CATEGORY_COLORS[cat];
          const services = koreanServices.filter(s => s.category === cat);
          return (
            <div key={cat} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded ${catInfo.bg} ${catInfo.text}`}>
                  {catInfo.icon} {cat}
                </span>
              </div>
              <div className="space-y-3">
                {services.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{s.logo}</span>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</h3>
                          {s.isFree && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">무료</span>
                          )}
                          {s.isNew && (
                            <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{s.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {s.features.map(f => (
                            <span key={f} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">{f}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 shrink-0">{s.price}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
