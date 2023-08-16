<script lang="ts">
  import { formatLispCode } from "$lib/processing/racket_code_formatter";
  import bgGradientImage from "$lib/assets/bg-gradient.jpg?as=run";
  import Img from "@zerodevx/svelte-img";
  import { DoubleBounce } from "svelte-loading-spinners";
  import { onMount, tick } from "svelte";

  let isDataLoading = false;

  let racketInput: string = "";
  let formattedRacketCode: string = "";
  const formatOptions = {
    insertSpaces: true,
    tabSize: 4,
    endOfLine: "LF",
  };

  let isPageLoaded = false;
  onMount(async () => (isPageLoaded = true));

  const handleSubmittedCode = async () => {
    if (racketInput.length > 1) {
      formattedRacketCode = formatLispCode(racketInput, formatOptions);
    }

    isDataLoading = true;

    const response = await fetch("/.netlify/functions/hilite", {
      method: "POST",
      body: JSON.stringify({ codeToFormat: formattedRacketCode }),
    });

    const HTMLResponse = await response.text();

    isDataLoading = false;
    await tick();

    // isDataLoading = false;
    updateDOM(HTMLResponse);
  };

  const updateDOM = (html : string) => {
    const formattedCodeElement = document.getElementById("formattedCodeDiv");
    console.log(formattedCodeElement);
    
      if (formattedRacketCode.length > 1) {
        if (formattedCodeElement !== null) {
          formattedCodeElement.innerHTML = html;
        }
      }
  }
</script>


<div
  id="optionModal"
  tabindex="-1"
  aria-hidden="true"
  class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 hidden overflow-x-hidden overflow-y-auto md:inset-0"
  style="background-color: rgba(0, 0, 0, 0.6);"
>
  <div class="relative w-full max-w-2xl">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div
        class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Options
        </h3>
        <button
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          on:click={() =>
            document.getElementById("optionModal")?.classList.add("hidden")}
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-6 space-y-6 flex flex-col justify-center">
        <label class="relative inline-flex items-center mb-4 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={formatOptions.insertSpaces}
            class="sr-only peer"
          />
          <div
            class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          />
          <span
            class="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300"
            >Insert Spaces</span
          >
        </label>

        <div>
          <label
            for="phone"
            class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >Tab Size</label
          >
          <input
            bind:value={formatOptions.tabSize}
            type="number"
            id="tab"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="4"
          />
        </div>
      </div>
      <!-- Modal footer -->
      <div
        class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
      >
        <button
          on:click={() => {
            handleSubmittedCode();
            document.getElementById("optionModal")?.classList.add("hidden");
          }}
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Apply
        </button>
        <button
          on:click={() =>
            document.getElementById("optionModal")?.classList.add("hidden")}
          type="button"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>

<div class="h-screen" style="">
  <div class="absolute inset-0 -z-50">
    <Img
      class="w-full h-full object-cover"
      src={bgGradientImage}
      alt="Hero Image"
      factor="0.5"
    />
  </div>
  <nav class="bg-transparent">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between ml-4 lg:ml-4 md:ml-3 sm:mx-auto p-4"
    >
      <a href="https://racket-lang.org/" class="flex items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Racket-logo.svg/1200px-Racket-logo.svg.png"
          class="h-8"
          alt="Racket Logo"
        />
        <span class="self-center text-3xl font-semibold whitespace-nowrap pl-2"
          >Racket Formatter</span
        >
      </a>
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none"
        aria-controls="navbar-default"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default" />
    </div>
  </nav>

  <div class="flex justify-center align-middle items-center h-screen">
    <div class="container h-3/6 mx-auto">
      <div
        class="flex h-full space-x-4 flex-col md:flex-row lg:flex-row gap-y-4 md:gap-y-0 gap-x-4"
      >
        <div class="flex-grow">
          <div class="bg-white h-full p-4 rounded-lg">
            <textarea
              id="inputCode"
              class="w-full h-5/6 resize-none border outline-none focus:outline-none pt-2 pl-2 rounded"
              bind:value={racketInput}
              placeholder="Enter your code here..."
            />
            <div
              class="lg:pt-4 md:pt-4 sm:pt-1 h-1/6 justify-between align-middle flex"
            >
              <button
                class="inline-flex items-center h-8 px-3 text-sm font-medium text-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg"
                on:click={() =>
                  document
                    .getElementById("optionModal")
                    ?.classList.remove("hidden")}
              >
                Options
                <svg
                  class="w-4 h-4 ml-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"
                  />
                </svg>
              </button>
              <button
                class="inline-flex items-center h-8 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg"
                on:click={() => handleSubmittedCode()}
              >
                Format Code
                <svg
                  class="w-4 h-4 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="flex-grow md:max-w-[calc(50vw+4rem)]">
          <div
            class="bg-white p-4 rounded-lg h-full max-h-full  overflow-scroll"
          >
            {#if !isDataLoading}
              <div
                class="whitespace-pre-wrap w-full h-full outline-none resize-none focus:outline-none"
              >
                <div class="w-full h-full" id="formattedCodeDiv">
                  Formatted code goes here...
                </div>
              </div>
            {:else}
              <div
                class="flex w-full h-full align-middle justify-center items-center"
              >
                <DoubleBounce
                  size="100"
                  color="black"
                  unit="px"
                  duration="1s"
                />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<footer class="bg-white m-2">
  <div
    class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between"
  >
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
      >Author: <a href="https://github.com/sethmorton" class=""
        ><u>Seth Morton</u></a
      >
      - {new Date().getFullYear()}
      <div class="">
        <u><a href="mailto:smphotography39@gmail.com">Contact me</a></u> to report
        a bug
      </div>
    </span>

    <ul
      class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0"
    >
      <li>
        <div class="mr-4 md:mr-6">
          Formatting logic derived from <a
            href="https://github.com/Sir2B/lispbeautifier"
            ><u>lispbeautifier</u></a
          > repository
        </div>
      </li>
    </ul>
  </div>
</footer>
