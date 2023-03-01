<template>
  <div class="container">
    <a-form
      ref="formRef"
      layout="vertical"
      :model="renderData"
      @submit-success="submitSuccess"
    >
      <a-space direction="vertical" :size="16">
        <a-card
          class="general-card"
          :title="readonly ? '密钥信息' : '新增密钥'"
        >
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                label="密钥名称"
                field="secretName"
                :rules="[
                  {
                    required: !readonly,
                    message: '密钥名称不能为空',
                  },
                ]"
              >
                <a-input v-model="renderData.secretName" :disabled="readonly" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="编码类型"
                field="encodingType"
                :rules="[
                  {
                    required: !readonly,
                    message: '编码类型不能为空',
                  },
                ]"
              >
                <a-select
                  v-model="renderData.encodingType"
                  :disabled="readonly"
                >
                  <a-option value="1">Hex16</a-option>
                  <a-option value="2">Base64</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="密钥类型"
                field="secretType"
                :rules="[
                  {
                    required: !readonly,
                    message: '密钥类型不能为空',
                  },
                ]"
              >
                <a-select
                  v-model="renderData.secretType"
                  :disabled="readonly"
                  allow-clear
                >
                  <a-option value="1">对称密钥</a-option>
                  <a-option value="2">非对称密钥</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="renderData.secretType === '1'" :gutter="80">
            <a-col>
              <a-form-item label="密钥" field="secretKey">
                <a-textarea
                  v-model="renderData.secretKey"
                  :disabled="readonly"
                  :max-length="256"
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="renderData.secretType === '2'" :gutter="80">
            <a-col>
              <a-form-item label="公钥" field="publicKey">
                <a-textarea
                  v-model="renderData.publicKey"
                  :disabled="readonly"
                  :max-length="256"
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="renderData.secretType === '2'" :gutter="80">
            <a-col>
              <a-form-item label="私钥" field="privateKey">
                <a-textarea
                  v-model="renderData.privateKey"
                  :disabled="readonly"
                  :max-length="256"
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-space>
      <div v-if="!readonly" class="actions">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit">
            提交
          </a-button>
          <a-button> 重置</a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    createSecret,
    querySecretDetail,
    SecretRecord,
    updateSecret,
  } from '@/api/biz/secret';

  const router = useRouter();
  const route = useRoute();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const renderData = ref<SecretRecord>({} as SecretRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const submitSuccess = async () => {
    setLoading(true);
    try {
      if (action.value === '0') {
        const { msg } = await createSecret(renderData.value);
        await router.push({
          name: 'SecretList',
        });
        Message.info(msg);
      } else if (action.value === '2') {
        const { secretId } = route.params;
        renderData.value.secretId = secretId as string;
        const { msg } = await updateSecret(renderData.value);
        await router.push({
          name: 'SecretList',
        });
        Message.info(msg);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    const { secretId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const { data } = await querySecretDetail({
          secretId,
        } as SecretRecord);
        renderData.value = data;
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  init();
</script>

<style scoped lang="less">
  .container {
    padding: 20px 20px 40px;
    overflow: hidden;
  }

  .actions {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    text-align: right;
    background: var(--color-bg-2);
  }
</style>
