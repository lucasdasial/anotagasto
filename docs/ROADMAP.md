# Roadmap — Anota Gasto

## Problema

Anotar gastos no momento em que acontecem é chato. Planilhas têm atrito demais. Apps financeiros são complexos demais. O resultado é que a maioria das pessoas não sabe para onde o dinheiro foi.

O Anota Gasto resolve isso com duas ações:

1. **Registrar rápido** — o menor atrito possível no momento do gasto
2. **Entender depois** — visualizar totais, categorias e tendências sem esforço

---

## Fase 0 — Fundação ✅

O usuário consegue criar uma conta e registrar despesas básicas.

- Criar conta com nome, celular e senha
- Fazer login e receber um token de acesso
- Criar, editar, visualizar e deletar despesas
- Categorizar cada gasto em uma das 13 categorias disponíveis

**Categorias:**

| Categoria            | O que cobre                                   |
| -------------------- | --------------------------------------------- |
| Supermercado         | Compras em mercado e feira                    |
| Alimentação fora     | Restaurante, delivery, lanche, café           |
| Limpeza e higiene    | Itens de limpeza e higiene doméstica          |
| Saúde                | Consultas e plano de saúde                    |
| Medicamentos         | Farmácia e remédios                           |
| Moradia              | Aluguel, condomínio, luz, água, gás           |
| Assinaturas          | Streaming, SaaS, serviços recorrentes         |
| Transporte público   | Ônibus, metrô, trem                           |
| Apps de transporte   | Uber, 99 e similares                          |
| Educação             | Cursos, livros, escola                        |
| Compras              | Eletrônicos e compras em geral                |
| Roupas               | Vestuário e acessórios                        |
| Dívidas              | Parcelas, empréstimos, cartão de crédito      |
| Lazer                | Cinema, viagens, hobbies                      |
| Beleza               | Salão, barbearia, cosméticos                  |
| Sem categoria        | Fallback para gastos não classificados        |

---

## Fase 1 — MVP funcional ✅

O usuário consegue navegar pelo histórico e entender o mês.

- Filtrar despesas por mês, categoria ou palavra-chave
- Navegar pelo histórico com paginação
- Ver o resumo do mês: total gasto, quantidade de despesas e quanto foi em cada categoria

---

## Fase 2 — Analytics (em andamento)

O usuário entende para onde o dinheiro foi e acompanha tendências ao longo do tempo.

- ✅ Ver total e distribuição por categoria em qualquer mês
- ✅ Ver quanto gastou em cada dia do mês
- ⬜ Ver a evolução dos gastos nos últimos 12 meses
- ⬜ Comparar dois meses lado a lado
- ⬜ Acompanhar a tendência de uma categoria ao longo do tempo

---

## Fase 3 — Segurança e perfil

O app fica seguro o suficiente para uso real e o usuário pode gerenciar a própria conta.

- Proteção contra tentativas de login em força bruta
- Token de acesso de curta duração com renovação automática
- Editar nome, celular e senha
- Fazer logout em todos os dispositivos

---

## Fase 4 — WhatsApp

O usuário registra um gasto sem precisar abrir o app — só manda uma mensagem.

- Registrar gasto por texto livre: `"gastei 50 almoço"`
- Consultar o total do mês: `"total"`
- Ver os últimos lançamentos: `"lista"`
- O app infere a categoria automaticamente pelo contexto da mensagem
- Futuramente: linguagem natural via IA para interpretar qualquer formato

---

## Fase 5 — Extras

Features avançadas pós-validação do produto.

- **Lançamento por linguagem natural** — text area no app com a mesma lógica do WhatsApp, sem precisar abrir o app de mensagens
- **Orçamentos por categoria** — definir um teto mensal e ser alertado quando ultrapassar
- **Despesas recorrentes** — marcar um gasto como recorrente; o app lembra de confirmar o pagamento todo mês
- **Export** — baixar as despesas de um período em CSV ou PDF
- **Foto do comprovante** — anexar um recibo à despesa
- **Tags livres** — complementar categorias com etiquetas personalizadas

---

## Fase 6 — Gastos em família

Um casal ou grupo compartilha o controle financeiro, cada um lançando os próprios gastos.

- Criar um grupo familiar e convidar membros por código
- Visualizar todos os gastos do grupo em um único lugar
- Filtrar por pessoa para ver quanto cada um gastou
- Relatórios e resumos consideram o grupo como escopo padrão

---

## Front-end

O MVP será uma SPA/PWA — sem instalação, abre direto no navegador. Flutter é considerado para uma fase futura se a experiência nativa (câmera para comprovantes, notificações ricas) se tornar prioridade.
