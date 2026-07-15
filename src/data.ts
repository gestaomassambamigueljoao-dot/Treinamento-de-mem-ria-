export interface QuestionOption {
  id: string;
  text: string;
  scoreValue?: number; // used optionally for rating/intensity
}

export interface Question {
  id: string;
  number: number;
  type: "single" | "scale" | "email";
  title: string;
  options?: QuestionOption[];
}

export interface ProfileDetails {
  id: string;
  name: string;
  description: string;
  duration: string;
  exercises: string;
  focus: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: "q1",
    number: 1,
    type: "single",
    title: "Com que frequência você esquece nomes ou compromissos importantes?",
    options: [
      { id: "q1_1", text: "Quase todos os dias" },
      { id: "q1_2", text: "Algumas vezes por semana" },
      { id: "q1_3", text: "Raramente" },
      { id: "q1_4", text: "Não tenho a certeza" }
    ]
  },
  {
    id: "q2",
    number: 2,
    type: "single",
    title: "Qual destas situações mais se identifica consigo?",
    options: [
      { id: "q2_1", text: "Estudo/trabalho e preciso memorizar muita informação" },
      { id: "q2_2", text: "Sinto que a minha memória piorou com a idade" },
      { id: "q2_3", text: "Distraio-me facilmente e perco o fio à meada" },
      { id: "q2_4", text: "Quero simplesmente treinar o cérebro" }
    ]
  },
  {
    id: "q3",
    number: 3,
    type: "single",
    title: "Quando lê algo, quanto tempo depois já não se lembra do conteúdo?",
    options: [
      { id: "q3_1", text: "Minutos depois" },
      { id: "q3_2", text: "Algumas horas depois" },
      { id: "q3_3", text: "No dia seguinte" },
      { id: "q3_4", text: "Consigo reter bem, mas quero melhorar" }
    ]
  },
  {
    id: "q4",
    number: 4,
    type: "single",
    title: "Já lhe aconteceu entrar numa divisão da casa e esquecer porquê?",
    options: [
      { id: "q4_1", text: "Sim, frequentemente" },
      { id: "q4_2", text: "Às vezes" },
      { id: "q4_3", text: "Raramente" },
      { id: "q4_4", text: "Nunca" }
    ]
  },
  {
    id: "q5",
    number: 5,
    type: "single",
    title: "Qual é a sua idade?",
    options: [
      { id: "q5_1", text: "Menos de 18" },
      { id: "q5_2", text: "18-24" },
      { id: "q5_3", text: "25-40" },
      { id: "q5_4", text: "41-60" },
      { id: "q5_5", text: "60+" }
    ]
  },
  {
    id: "q6",
    number: 6,
    type: "single",
    title: "Sente que a sua capacidade de concentração diminuiu nos últimos anos?",
    options: [
      { id: "q6_1", text: "Sim, notei bastante" },
      { id: "q6_2", text: "Um pouco" },
      { id: "q6_3", text: "Não notei diferença" },
      { id: "q6_4", text: "Nunca tive boa concentração" }
    ]
  },
  {
    id: "q7",
    number: 7,
    type: "single",
    title: "Com que frequência sente a mente \"às voltas\" sem conseguir focar numa tarefa?",
    options: [
      { id: "q7_1", text: "Todos os dias" },
      { id: "q7_2", text: "Algumas vezes por semana" },
      { id: "q7_3", text: "Ocasionalmente" },
      { id: "q7_4", text: "Quase nunca" }
    ]
  },
  {
    id: "q8",
    number: 8,
    type: "single",
    title: "Já perdeu objetos pessoais (chaves, telemóvel, óculos) por esquecimento nos últimos 7 dias?",
    options: [
      { id: "q8_1", text: "Sim, mais de uma vez" },
      { id: "q8_2", text: "Sim, uma vez" },
      { id: "q8_3", text: "Não" }
    ]
  },
  {
    id: "q9",
    number: 9,
    type: "single",
    title: "Estuda ou precisa de assimilar muita informação regularmente?",
    options: [
      { id: "q9_1", text: "Sim, sou estudante" },
      { id: "q9_2", text: "Sim, para o trabalho/concursos" },
      { id: "q9_3", text: "Não regularmente, mas gostaria de aprender mais" },
      { id: "q9_4", text: "Não" }
    ]
  },
  {
    id: "q10",
    number: 10,
    type: "single",
    title: "Como descreveria as suas noites de sono?",
    options: [
      { id: "q10_1", text: "Durmo mal / poucas horas" },
      { id: "q10_2", text: "Sono irregular" },
      { id: "q10_3", text: "Durmo bem" },
      { id: "q10_4", text: "Não sei dizer" }
    ]
  },
  {
    id: "q11",
    number: 11,
    type: "single",
    title: "Já sentiu ansiedade ou frustração por não conseguir lembrar-se de algo importante numa hora crucial (exame, reunião, conversa)?",
    options: [
      { id: "q11_1", text: "Sim, muitas vezes" },
      { id: "q11_2", text: "Já aconteceu algumas vezes" },
      { id: "q11_3", text: "Raramente" },
      { id: "q11_4", text: "Nunca" }
    ]
  },
  {
    id: "q12",
    number: 12,
    type: "single",
    title: "Quanto tempo por dia estaria disposto(a) a dedicar a exercícios de memória?",
    options: [
      { id: "q12_1", text: "5-10 minutos" },
      { id: "q12_2", text: "10-20 minutos" },
      { id: "q12_3", text: "20-30 minutos" },
      { id: "q12_4", text: "Mais de 30 minutos" }
    ]
  },
  {
    id: "q13",
    number: 13,
    type: "single",
    title: "Qual é o seu maior objetivo ao melhorar a memória?",
    options: [
      { id: "q13_1", text: "Ter melhor desempenho em estudos/exames" },
      { id: "q13_2", text: "Ser mais produtivo no trabalho" },
      { id: "q13_3", text: "Preservar a saúde cognitiva com a idade" },
      { id: "q13_4", text: "Ter mais confiança no dia a dia" }
    ]
  },
  
  // Custom VSL will be shown in between quiz flows as specified.
  
  // Last 5 personalization questions
  {
    id: "q14",
    number: 14,
    type: "single",
    title: "Já tentou alguma técnica ou aplicação para melhorar a memória antes?",
    options: [
      { id: "q14_1", text: "Sim, mas não funcionou" },
      { id: "q14_2", text: "Sim, e ajudou um pouco" },
      { id: "q14_3", text: "Não, esta é a primeira vez" }
    ]
  },
  {
    id: "q15",
    number: 15,
    type: "single",
    title: "Prefere aprender através de:",
    options: [
      { id: "q15_1", text: "Leitura e texto" },
      { id: "q15_2", text: "Vídeos e exercícios práticos" },
      { id: "q15_3", text: "Áudio/repetição" },
      { id: "q15_4", text: "Combinação de tudo" }
    ]
  },
  {
    id: "q16",
    number: 16,
    type: "single",
    title: "Qual destas frases mais se aplica a si neste momento?",
    options: [
      { id: "q16_1", text: "Preciso de resultados rápidos, tenho um exame/prazo em breve" },
      { id: "q16_2", text: "Quero construir um hábito a longo prazo" },
      { id: "q16_3", text: "Só quero perceber se realmente tenho um problema" }
    ]
  },
  {
    id: "q17",
    number: 17,
    type: "scale",
    title: "Numa escala de 1 a 5, quão comprometido(a) está em seguir um plano de 30 dias?",
    options: [
      { id: "q17_1", text: "1 (pouco)" },
      { id: "q17_2", text: "2" },
      { id: "q17_3", text: "3" },
      { id: "q17_4", text: "4" },
      { id: "q17_5", text: "5 (totalmente)" }
    ]
  },
  {
    id: "q18",
    number: 18,
    type: "email",
    title: "Qual email quer usar para receber o seu plano personalizado?"
  }
];

export const PROFILES: Record<string, ProfileDetails> = {
  "perfil_1": {
    id: "perfil_1",
    name: "Memória de Curto Prazo em Desenvolvimento",
    description: "As suas respostas mostram que a principal dificuldade está em reter informação recente — você absorve o conteúdo, mas ele \"escapa\" antes de ser consolidado. É um padrão muito comum e totalmente treinável.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Retenção e consolidação"
  },
  "perfil_2": {
    id: "perfil_2",
    name: "Memória Académica em Formação",
    description: "As suas respostas mostram que o seu maior desafio está ligado ao estudo: absorve o conteúdo nas aulas ou leituras, mas tem dificuldade em recuperá-lo na hora do exame. Isto normalmente não é falta de capacidade — é falta de técnica de memorização ativa.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Retenção para exames e concentração no estudo"
  },
  "perfil_3": {
    id: "perfil_3",
    name: "Foco Cognitivo Disperso",
    description: "As suas respostas revelam que a raiz do problema pode não ser bem a memória — é a concentração. Quando a mente não fixa completamente numa tarefa, a informação nunca chega a ser bem armazenada. Trabalhar o foco é o primeiro passo para melhorar a retenção.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Concentração e atenção plena"
  },
  "perfil_4": {
    id: "perfil_4",
    name: "Memória Profissional em Consolidação",
    description: "As suas respostas mostram que precisa reter informação de forma consistente para o trabalho ou para concursos — mas a rotina intensa dificulta a fixação de novos conteúdos. O seu plano foi ajustado para encaixar em pouco tempo por dia, com máxima eficiência.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Retenção eficiente com pouco tempo disponível"
  },
  "perfil_5": {
    id: "perfil_5",
    name: "Vitalidade Cognitiva em Manutenção",
    description: "As suas respostas indicam que já notou alguma mudança na forma como a memória funciona — algo absolutamente normal ao longo dos anos. A boa notícia: o cérebro responde bem a estímulo e prática constante, em qualquer idade. Este plano foi ajustado para exercícios simples e progressivos.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Manutenção e estímulo cognitivo diário"
  },
  "perfil_6": {
    id: "perfil_6",
    name: "Memória Sob Pressão",
    description: "As suas respostas mostram que o problema piora especialmente em momentos de maior exigência — exames, reuniões, apresentações. Não é falta de memória, é a forma como a ansiedade interfere na recuperação da informação na hora certa. O plano foi ajustado para trabalhar retenção E gestão do momento de recall.",
    duration: "30 dias",
    exercises: "12 exercícios práticos",
    focus: "Retenção sob pressão e controlo da ansiedade"
  }
};

// Returns matching profile key based on collected answers
export function determineProfile(answers: Record<string, string>): string {
  // We compute scores/tallies for each profile.
  // Default to perfil_1 as baseline
  const scores: Record<string, number> = {
    perfil_1: 2, // base weight for general
    perfil_2: 0, // academic
    perfil_3: 0, // focus dispersed
    perfil_4: 0, // professional
    perfil_5: 0, // vital age maintenance
    perfil_6: 0  // memory under pressure
  };

  // Rule 1: Age / Vitality logic
  const ageAns = answers["q5"];
  if (ageAns === "q5_4" || ageAns === "q5_5") {
    scores["perfil_5"] += 5; // highly likely to be vital maintenance
  }

  // Rule 2: Student vs Professional vs General
  const sitAns = answers["q2"];
  const studyAns = answers["q9"];
  const goalAns = answers["q13"];

  if (sitAns === "q2_1" || studyAns === "q9_1" || goalAns === "q13_1") {
    scores["perfil_2"] += 5; // academic
  }
  
  if (studyAns === "q9_2" || goalAns === "q13_2" || (sitAns === "q2_1" && (ageAns === "q5_3" || ageAns === "q5_4"))) {
    scores["perfil_4"] += 5; // professional
  }

  // Rule 3: Focus/Concentration Dispersed
  const concAns = answers["q6"];
  const mindAns = answers["q7"];
  if (concAns === "q6_1" || mindAns === "q7_1" || mindAns === "q7_2" || sitAns === "q2_3") {
    scores["perfil_3"] += 5; // dispersed focus
  }

  // Rule 4: Memory under pressure
  const anxAns = answers["q11"];
  const quickAns = answers["q16"];
  if (anxAns === "q11_1" || anxAns === "q11_2") {
    scores["perfil_6"] += 4;
    if (quickAns === "q16_1") {
      scores["perfil_6"] += 4; // High commitment to fast results + pressure
    }
  }

  // Rule 5: Short term development
  const q1Ans = answers["q1"];
  const q8Ans = answers["q8"];
  const q4Ans = answers["q4"];
  if (q1Ans === "q1_1" || q8Ans === "q8_1" || q4Ans === "q4_1" || q1Ans === "q1_2") {
    scores["perfil_1"] += 4; // short term forgetful
  }

  // Determine highest score
  let bestProfile = "perfil_1";
  let maxScore = -1;
  for (const k in scores) {
    if (scores[k] > maxScore) {
      maxScore = scores[k];
      bestProfile = k;
    }
  }

  return bestProfile;
}
