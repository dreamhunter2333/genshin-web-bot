<script setup>
import { NInput, NButton, NSpace, NCard, NSpin, NInputNumber, NFormItem } from 'naive-ui'
import { ref } from "vue";
import MarkdownIt from 'markdown-it';

const API_BASE = import.meta.env.VITE_API_BASE || "";
const md = new MarkdownIt();
md.renderer.rules.image = function (tokens, idx, options, env, self) {
  let imgToken = tokens[idx];
  let src = imgToken.attrs[0][1];
  return `<img src="${src}" style="max-width: 100%; height: auto;" />`;
}

const uid = ref(null);
const command = ref(null);
const result = ref("");
const loading = ref(false);

const onSubmit = async (isUid) => {
  try {
    loading.value = true;
    let curCommand = isUid ? `#绑定${uid.value}` : (command.value || "#帮助");
    const response = await fetch(`${API_BASE}/api/genshin`, {
      method: "POST",
      body: JSON.stringify({
        uid: uid.value,
        command: curCommand,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${await response.text()}` || "请求失败");
    }
    let res = await response.json();
    result.value = md.render(res["text"]);
  } catch (error) {
    console.error(error);
    result.value = error.message || "请求失败";
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <n-spin :show="loading">
    <div class="main">
      <n-space vertical>
        <h1>原</h1>
        <h4>本项目仅供娱乐，请先点击绑定，#帮助 #喵喵帮助 查看指令</h4>
        <div style="display: inline-block;">
          <n-form-item label="UID" label-placement="left">
            <n-input-number v-model:value="uid" :min="100000000" :max="900000000" placeholder="请输入UID" />
          </n-form-item>
          <n-form-item label="指令" label-placement="left">
            <n-input v-model:value="command" type="textarea" placeholder="#帮助 #喵喵帮助" />
          </n-form-item>
        </div>
        <div class="button-container">
          <n-button class="center" @click="onSubmit(true)" tertiary round type="primary">
            绑定
          </n-button>
          <n-button class="center" @click="onSubmit(false)" tertiary round type="primary">
            发送
          </n-button>
        </div>
        <n-card v-if="result">
          <div class="result" v-html="result"></div>
        </n-card>
      </n-space>
    </div>
  </n-spin>
</template>

<style scoped>
.side {
  height: 100vh;
}

.main {
  height: 100vh;
  text-align: center;
}

.n-grid {
  height: 100%;
}

.n-gi {
  height: 100%;
}

.n-space {
  height: 100%;
}

.button-container {
  display: flex;
  justify-content: center;
}

.n-button {
  margin-top: 12px;
  text-align: center;
  margin-bottom: 12px;
}

.result {
  text-align: center;
}
</style>
