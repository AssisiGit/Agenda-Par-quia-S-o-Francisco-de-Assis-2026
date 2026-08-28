'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale/pt-BR';

const pastoraisPorComunidade: Record<string, string[]> = {
  'Matriz São Francisco de Assis (SFA)': [
    'Amigos Canção Nova', 'Animação', 'Comissão de Construção', 'Escolinha de Jesus',
    'Grupo de Oração O Bom Pastor – RCC', 'MESCE\'s', 'Movimento Serra',
    'Obra Social São Francisco de Assis', 'Ornamentação Litúrgica', 'Pastoral da Acolhida',
    'Pastoral da Catequese Infantil', 'Pastoral da Criança', 'Pastoral da Liturgia',
    'Pastoral da Música', 'Pastoral da Perseverança', 'Pastoral da Pessoa Idosa',
    'Pastoral do Dízimo', 'Pastoral dos Adolescentes - PA', 'Terço dos Homens'
  ],
  'São Pedro Pescador (SPP)': [
    'AMO', 'Animação', 'Bordados', 'Cantina', 'Círculos Bíblicos', 'MESCE',
    'Pastoral da Acolhida', 'Pastoral da Catequese', 'Pastoral da Criança',
    'Pastoral da Crisma', 'Pastoral da Liturgia', 'Pastoral da Música',
    'Pastoral do Dízimo', 'Secretaria'
  ],
  'Sagrado Coração de Jesus (SCJ)': [
    'Animação', 'Apostolado da Oração', 'Bazar', 'MESCE\'s', 'Pastoral Catequética',
    'Pastoral da Acolhida', 'Pastoral da Música', 'Pastoral da Saúde - Farmácia',
    'Pastoral da Saúde - Visita aos Doentes', 'Pastoral do Dízimo', 'Pastoral Litúrgica',
    'Secretaria', 'Trabalhos Manuais'
  ],
  'Santa Clara de Assis (SCA)': [
    'Animação', 'MESCE\'s', 'Obra Social', 'Pastoral da Acolhida', 'Pastoral da Música',
    'Pastoral do Dízimo', 'Pastoral Litúrgica', 'Secretaria', 'Trabalhos Manuais'
  ],
  'Conselho de Pastoral Paroquial CPP': [
    'Administrador Paroquial - Padre', 'Coordenador do CPP', 'Pastoral da Liturgia Paroquial', 'Pastoral do Dízimo Paroquial', 'MESCE Paroquial',
    'Pastoral do Batismo Paroquial', 'Pastoral Familiar Paroquial', 'Encontro de Caisais com Crito - ECC', 'Pastoral da Crisma Paroquial',
    'Pastoral dos Coroinhas Paroquial', 'Catecumenato Paroquial', 'Encontro de Jovens com Cristo - EJC', 'Pastoral da Música Paroquial',
  ]
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  
  const [etapa, setEtapa] = useState(1);
  const [comunidadeSelecionada, setComunidadeSelecionada] = useState('');
  const [pastoralSelecionada, setPastoralSelecionada] = useState('');
  const [responsavel, setResponsavel] = useState('');
  
  // Estados para o DatePicker
  const [data1, setData1] = useState<Date | null>(null);
  const [data2, setData2] = useState<Date | null>(null);

  const [meusEventos, setMeusEventos] = useState<any[]>([]);

  useEffect(() => {
    const salvos = localStorage.getItem('historicoEventosParoquia');
    if (salvos) {
      setMeusEventos(JSON.parse(salvos));
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMensagem('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.comunidade = comunidadeSelecionada;
    data.pastoral = pastoralSelecionada;
    data.responsavel = responsavel;
    
    // Converte as datas do DatePicker para o formato DD/MM/AAAA antes de enviar
    if (data1) data.data1 = data1.toLocaleDateString('pt-BR');
    if (data2) data.data2 = data2.toLocaleDateString('pt-BR');

    try {
      const response = await fetch('/api/salvar-evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensagem('Evento cadastrado com sucesso!');
        
        const novaLista = [data, ...meusEventos];
        setMeusEventos(novaLista);
        localStorage.setItem('historicoEventosParoquia', JSON.stringify(novaLista));

        form.reset();
        setData1(null);
        setData2(null);
      } else {
        setMensagem('Erro ao salvar o evento na planilha.');
      }
    } catch (error) {
      console.error("Detalhe do erro:", error); 
      setMensagem('Erro de conexão.');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 3000); 
    }
  }

  const pastoraisAtuais = pastoraisPorComunidade[comunidadeSelecionada] || [];
  const podeAvancar = comunidadeSelecionada !== '' && pastoralSelecionada !== '' && responsavel.trim() !== '';

  const eventosFiltrados = meusEventos.filter(
    (evento) => evento.responsavel?.trim().toLowerCase() === responsavel.trim().toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
      <main className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-amber-900 uppercase tracking-widest drop-shadow-sm">Agenda 2026</h1>
          <div className="h-1 w-24 bg-amber-700 mx-auto mt-4 rounded-full opacity-80"></div>
          <p className="mt-3 text-stone-500 font-medium tracking-wide text-sm uppercase">Paróquia São Francisco de Assis</p>
        </div>

        {etapa === 1 && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-stone-100 transform transition-all">
            <h2 className="text-xl font-bold mb-8 text-amber-900 border-b-2 border-amber-100 pb-3 flex items-center gap-2">
              <span className="bg-amber-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
              Identificação
            </h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-bold text-sm text-stone-600 uppercase tracking-wider">Comunidade</label>
                  <select 
                    className="border-b-2 border-stone-200 py-3 bg-transparent focus:border-amber-700 outline-none transition-all text-stone-800 cursor-pointer"
                    value={comunidadeSelecionada}
                    onChange={(e) => {
                      setComunidadeSelecionada(e.target.value);
                      setPastoralSelecionada('');
                    }}
                  >
                    <option value="">Selecione a comunidade...</option>
                    <option value="Matriz São Francisco de Assis (SFA)">Matriz SFA</option>
                    <option value="São Pedro Pescador (SPP)">São Pedro Pescador (SPP)</option>
                    <option value="Sagrado Coração de Jesus (SCJ)">Sagrado Coração de Jesus (SCJ)</option>
                    <option value="Santa Clara de Assis (SCA)">Santa Clara de Assis (SCA)</option>
                    <option value="Conselho de Pastoral Paroquial CPP">Conselho de Pastoral Paroquial CPP</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-bold text-sm text-stone-600 uppercase tracking-wider">Pastoral / Movimento</label>
                  <select 
                    className="border-b-2 border-stone-200 py-3 bg-transparent disabled:opacity-50 focus:border-amber-700 outline-none transition-all text-stone-800 cursor-pointer"
                    disabled={!comunidadeSelecionada}
                    value={pastoralSelecionada}
                    onChange={(e) => setPastoralSelecionada(e.target.value)}
                  >
                    <option value="">Selecione a pastoral...</option>
                    {pastoraisAtuais.map((nome) => (
                      <option key={nome} value={nome}>{nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:w-1/2 md:ml-auto mt-2">
                <label className="font-bold text-sm text-stone-600 uppercase tracking-wider">Preenchido por:</label>
                <input 
                  type="text" 
                  placeholder="Seu nome completo" 
                  className="border-b-2 border-stone-200 py-3 bg-transparent focus:border-amber-700 outline-none transition-all text-stone-800 placeholder-stone-400"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setEtapa(2)}
                  disabled={!podeAvancar}
                  className="bg-amber-900 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Avançar para Agenda ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            <div className="bg-gradient-to-r from-amber-900 to-amber-800 p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-10 -mr-4 pointer-events-none">📝</div>
              <div className="z-10">
                <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mb-1">{comunidadeSelecionada}</p>
                <p className="text-2xl font-extrabold">{pastoralSelecionada}</p>
              </div>
              <div className="text-left md:text-right z-10 w-full md:w-auto">
                <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mb-1">Responsável</p>
                <p className="font-semibold text-lg">{responsavel}</p>
              </div>
              <button 
                onClick={() => setEtapa(1)}
                className="z-10 mt-2 md:mt-0 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full transition-all w-full md:w-auto font-medium"
              >
                ✎ Alterar Origem
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-stone-100 flex flex-col gap-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
                <label className="font-bold text-amber-900 text-lg uppercase tracking-wide w-24 sm:shrink-0">Evento:</label>
                <input type="text" name="eventoNome" required className="border-b-2 border-stone-300 py-2 focus:border-amber-700 outline-none text-xl bg-transparent w-full text-stone-800 placeholder-stone-300 font-medium" placeholder="Ex: Reunião Mensal" />
              </div>
              
              <div className="flex flex-col gap-8 mt-2 bg-[#FAF9F6] p-6 rounded-xl border border-stone-100 shadow-inner">
                
                {/* Bloco Data com DatePicker */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <label className="font-bold text-amber-900 text-lg uppercase tracking-wide w-24 sm:shrink-0">Data:</label>
                  <div className="flex flex-col sm:flex-row gap-6 w-full">
                    <div className="flex items-center gap-3 w-full bg-white px-4 py-2 rounded-lg border border-stone-200 focus-within:border-amber-700 transition-colors">
                      <span className="text-sm font-bold text-stone-400 uppercase">De</span>
                      <DatePicker
                        selected={data1}
                        onChange={(date: Date | null) => setData1(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        name="data1"
                        required
                        placeholderText="DD/MM/AAAA"
                        className="outline-none bg-transparent w-full font-medium text-stone-700 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full bg-white px-4 py-2 rounded-lg border border-stone-200 focus-within:border-amber-700 transition-colors">
                      <span className="text-sm font-bold text-stone-400 uppercase">Até</span>
                      <DatePicker
                        selected={data2}
                        onChange={(date: Date | null) => setData2(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        name="data2"
                        placeholderText="DD/MM/AAAA"
                        className="outline-none bg-transparent w-full font-medium text-stone-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Bloco Horário com Máscara */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <label className="font-bold text-amber-900 text-lg uppercase tracking-wide w-24 sm:shrink-0">Horário:</label>
                  <div className="flex flex-col sm:flex-row gap-6 w-full">
                    <div className="flex items-center gap-3 w-full bg-white px-4 py-2 rounded-lg border border-stone-200 focus-within:border-amber-700 transition-colors">
                      <span className="text-sm font-bold text-stone-400 uppercase">Das</span>
                      <input 
                        type="text" 
                        id="hora1" 
                        name="hora1" 
                        placeholder="00:00"
                        maxLength={5}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length >= 3) {
                            v = v.slice(0, 2) + ':' + v.slice(2, 4);
                          }
                          e.target.value = v;
                        }}
                        className="outline-none bg-transparent w-full font-medium text-stone-700 cursor-pointer" 
                      />                    
                    </div>
                    <div className="flex items-center gap-3 w-full bg-white px-4 py-2 rounded-lg border border-stone-200 focus-within:border-amber-700 transition-colors">
                      <span className="text-sm font-bold text-stone-400 uppercase">Às</span>
                      <input 
                        type="text" 
                        id="hora2" 
                        name="hora2" 
                        placeholder="00:00"
                        maxLength={5}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length >= 3) {
                            v = v.slice(0, 2) + ':' + v.slice(2, 4);
                          }
                          e.target.value = v;
                        }}
                        className="outline-none bg-transparent w-full font-medium text-stone-700 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mt-2">
                <label className="font-bold text-amber-900 text-lg uppercase tracking-wide w-24 sm:shrink-0">Local:</label>
                <input type="text" name="local" required className="border-b-2 border-stone-300 py-2 focus:border-amber-700 outline-none text-xl bg-transparent w-full text-stone-800 placeholder-stone-300 font-medium" placeholder="Ex: Salão Paroquial" />
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-amber-900 text-white font-extrabold py-5 rounded-xl hover:bg-amber-800 disabled:opacity-70 transition-all text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex justify-center items-center gap-2">
                  {loading ? (
                    <span className="animate-pulse">Processando...</span>
                  ) : (
                    <>
                      <span className="text-2xl leading-none">+</span> Salvar na Agenda Geral
                    </>
                  )}
                </button>
              </div>

              {mensagem && (
                <div className={`p-4 rounded-xl text-center font-bold text-lg border-2 ${mensagem.includes('sucesso') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {mensagem}
                </div>
              )}
            </form>

            {eventosFiltrados.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-col items-center mb-6">
                  <h2 className="text-2xl font-extrabold text-amber-900 uppercase tracking-widest border-b-2 border-amber-200 pb-2 px-8">Meus Lançamentos</h2>
                  <p className="text-xs text-stone-500 font-medium mt-3 bg-stone-100 px-3 py-1 rounded-full">Exibindo apenas os eventos cadastrados por você neste aparelho.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-5 max-h-[600px] overflow-y-auto pr-2 pb-6 custom-scrollbar">
                  {eventosFiltrados.map((evento, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border-l-8 border-l-amber-700 shadow-md flex flex-col sm:flex-row justify-between gap-4 sm:items-center hover:shadow-lg transition-shadow">
                      
                      <div className="flex-1">
                        <h3 className="font-extrabold text-stone-800 text-xl mb-1">{evento.eventoNome}</h3>
                        <p className="text-sm font-semibold text-amber-700">{evento.local}</p>
                        
                        <div className="mt-2 inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                          <span>👤</span> {evento.responsavel}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100 min-w-[200px]">
                        <div className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                          <span className="bg-stone-200 p-1.5 rounded-md text-xs">📅</span>
                          <span>{evento.data1} {evento.data2 && `a ${evento.data2}`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                          <span className="bg-stone-200 p-1.5 rounded-md text-xs">⏰</span>
                          <span>{evento.hora1} {evento.hora2 && `às ${evento.hora2}`}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}