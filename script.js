document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter referências aos elementos HTML
    const pokemonInput = document.getElementById('pokemonInput');
    const searchBtn = document.getElementById('searchBtn');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const pokemonCard = document.getElementById('pokemonCard');

    const pokemonNameElement = document.getElementById('pokemonName');
    const pokemonNumberElement = document.getElementById('pokemonNumber');
    const pokemonSpriteElement = document.getElementById('pokemonSprite');
    const pokemonHeightElement = document.getElementById('pokemonHeight');
    const pokemonWeightElement = document.getElementById('pokemonWeight');
    const pokemonTypesElement = document.getElementById('pokemonTypes');

    // 2. Funções para gerenciar a visibilidade dos elementos (loading, erro, card)
    function showLoading() {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        pokemonCard.classList.add('hidden');
    }

    function showError() {
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
        pokemonCard.classList.add('hidden');
    }

    function showPokemonCard() {
        loadingElement.classList.add('hidden');
        errorElement.classList.add('hidden');
        pokemonCard.classList.remove('hidden');
    }

    function hideAll() {
        loadingElement.classList.add('hidden');
        errorElement.classList.add('hidden');
        pokemonCard.classList.add('hidden');
    }

    // 3. Função para buscar dados do Pokémon na PokeAPI
    async function fetchPokemonData(pokemonNameOrId) {
        showLoading(); // Exibe a mensagem de carregamento

        try {
            // Converter a entrada para minúsculas para nomes (PokeAPI geralmente usa minúsculas)
            const query = String(pokemonNameOrId).toLowerCase();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}/`);

            if (!response.ok) {
                // Se a resposta não for OK (ex: 404 Not Found)
                if (response.status === 404) {
                    throw new Error(`Pokémon "${pokemonNameOrId}" não encontrado.`);
                }
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Erro ao buscar dados do Pokémon:", error);
            showError(); // Exibe a mensagem de erro na UI
            return null; // Retorna nulo em caso de erro
        }
    }

    // 4. Função para exibir os dados do Pokémon no HTML
    function displayPokemon(pokemonData) {
        if (!pokemonData) {
            // Se não houver dados válidos (ex: erro na busca), não exibe o card
            hideAll(); // Garante que tudo esteja escondido
            return;
        }

        // Preencher nome e número
        pokemonNameElement.textContent = capitalizeFirstLetter(pokemonData.name);
        // O ID do Pokémon vem como um número. padStart(3, '0') formata para '001', '025' etc.
        pokemonNumberElement.textContent = `#${pokemonData.id.toString().padStart(3, '0')}`;

        // Preencher imagem (sprite frontal padrão)
        // A API fornece várias sprites. 'front_default' é uma boa opção para começar.
        pokemonSpriteElement.src = pokemonData.sprites.front_default;
        pokemonSpriteElement.alt = `Sprite de ${capitalizeFirstLetter(pokemonData.name)}`;

        // Preencher altura (vem em decímetros, converter para metros)
        const heightInMeters = (pokemonData.height / 10).toFixed(1); // 1 decímetro = 0.1 metro
        pokemonHeightElement.textContent = `${heightInMeters} m`;

        // Preencher peso (vem em hectogramas, converter para quilogramas)
        const weightInKg = (pokemonData.weight / 10).toFixed(1); // 1 hectograma = 0.1 kg
        pokemonWeightElement.textContent = `${weightInKg} kg`;

        // Preencher tipo(s)
        // A API retorna um array de objetos para os tipos.
        // Mapeamos o array para extrair apenas os nomes dos tipos e juntamos com vírgula.
        const types = pokemonData.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name));
        pokemonTypesElement.textContent = types.join(', '); // Ex: "Electric", ou "Grass, Poison"

        showPokemonCard(); // Exibe o card do Pokémon
    }

    // Função auxiliar para capitalizar a primeira letra de uma string
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // 5. Lógica para o evento de clique do botão de busca
    searchBtn.addEventListener('click', async () => {
        const inputValue = pokemonInput.value.trim(); // Obter o valor do input e remover espaços extras

        if (inputValue) { // Verificar se o input não está vazio
            const pokemonData = await fetchPokemonData(inputValue);
            displayPokemon(pokemonData);
        } else {
            // Se o input estiver vazio, esconde tudo e pode opcionalmente mostrar um alerta
            hideAll();
            alert('Por favor, digite o nome ou número de um Pokémon.');
        }
    });

    // 6. Opcional: Adicionar evento para buscar ao pressionar "Enter" no campo de input
    pokemonInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click(); // Simula um clique no botão de busca
        }
    });

    // 7. Opcional: Carregar um Pokémon inicial ao carregar a página
    async function loadInitialPokemon() {
        const initialPokemon = 'pikachu'; // Você pode mudar para outro Pokémon ou ID (ex: '25')
        const pokemonData = await fetchPokemonData(initialPokemon);
        displayPokemon(pokemonData);
    }

    // Chamar a função para carregar o Pokémon inicial assim que o DOM estiver pronto
    loadInitialPokemon();
});