<template>
  <div class="container">
    <a-form
      ref="formRef"
      :model="applicationFormData"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      label-align="right"
      @submit-success="submitSuccess"
    >
      <a-space direction="vertical" :size="16">
        <a-card class="general-card" title="基本信息">
          <a-grid :cols="2">
            <a-grid-item>
              <a-form-item
                label="应用名称"
                field="appName"
                :rules="[
                  {
                    required: !readonly,
                    message: '应用名称不能为空',
                  },
                ]"
              >
                <a-input
                  v-model="applicationFormData.appName"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                label="应用key"
                field="appKey"
                help="不填则自动生成!"
              >
                <a-input
                  v-model="applicationFormData.appKey"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                label="应用secret"
                field="appSecret"
                help="不填则自动生成!"
              >
                <a-input
                  v-model="applicationFormData.appSecret"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-card>
        <a-card class="general-card" title="企业信息">
          <a-grid :cols="2">
            <a-grid-item>
              <a-form-item
                label="企业编号"
                field="enterpriseId"
                :rules="[
                  {
                    required: !readonly,
                    message: '企业编号不能为空',
                  },
                ]"
              >
                <a-input v-model="enterpriseFormData.enterpriseId" disabled />
                <a-button
                  v-if="!readonly"
                  type="primary"
                  style="margin-left: 8px"
                  @click="enterpriseModalVisible = !enterpriseModalVisible"
                >
                  选择企业
                </a-button>
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="企业名称" field="enterpriseName">
                <a-input v-model="enterpriseFormData.enterpriseName" disabled />
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-card>
        <a-card class="general-card" title="密钥信息">
          <a-row>
            <a-col :span="12">
              <a-form-item label="是否加密请求" field="cryptorEnable">
                <a-switch
                  v-model="applicationFormData.cryptorEnable"
                  checked-value="1"
                  unchecked-value="0"
                >
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider v-if="applicationFormData.cryptorEnable === '1'" />
          <div>
            <a-row>
              <a-col
                v-if="applicationFormData.cryptorEnable === '1'"
                :span="12"
              >
                <a-form-item label="请求密钥编号" field="requestSecretId">
                  <a-input v-model="requestSecretFormData.secretId" disabled />
                  <a-button
                    v-if="!readonly"
                    type="primary"
                    style="margin-left: 8px"
                    @click="
                      requestSecretModalVisible = !requestSecretModalVisible
                    "
                  >
                    选择密钥
                  </a-button>
                </a-form-item>
              </a-col>
              <a-col
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.requestSecretId
                "
                :span="12"
              >
                <a-form-item label="密钥名称" field="secretName">
                  <a-input
                    v-model="requestSecretFormData.secretName"
                    disabled
                  />
                  <a-button
                    type="text"
                    @click="
                      () => (requestSecretShowMore = !requestSecretShowMore)
                    "
                    >{{
                      requestSecretShowMore ? '收起' : '查看详细信息'
                    }}</a-button
                  >
                </a-form-item>
              </a-col>
            </a-row>
            <div v-show="requestSecretShowMore">
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.requestSecretId
                "
              >
                <a-col :span="12">
                  <a-form-item label="编码类型" field="encodingType">
                    <a-select
                      v-model="requestSecretFormData.encodingType"
                      disabled
                    >
                      <a-option value="1">Hex16</a-option>
                      <a-option value="2">Base64</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="密钥类型" field="secretType">
                    <a-select
                      v-model="requestSecretFormData.secretType"
                      disabled
                      allow-clear
                    >
                      <a-option value="1">对称密钥</a-option>
                      <a-option value="2">非对称密钥</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.requestSecretId &&
                  requestSecretFormData.secretType === '1'
                "
              >
                <a-form-item
                  label="密钥"
                  field="secretKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="requestSecretFormData.secretKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.requestSecretId &&
                  requestSecretFormData.secretType === '2'
                "
              >
                <a-form-item
                  label="公钥"
                  field="publicKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="requestSecretFormData.publicKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.requestSecretId &&
                  requestSecretFormData.secretType === '2'
                "
              >
                <a-form-item
                  label="私钥"
                  field="privateKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="requestSecretFormData.privateKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
            </div>
          </div>
          <a-divider v-if="applicationFormData.cryptorEnable === '1'" />
          <div>
            <a-row>
              <a-col
                v-if="applicationFormData.cryptorEnable === '1'"
                :span="12"
              >
                <a-form-item label="响应密钥编号" field="requestSecretId">
                  <a-input v-model="responseSecretFormData.secretId" disabled />
                  <a-button
                    v-if="!readonly"
                    type="primary"
                    style="margin-left: 8px"
                    @click="
                      responseSecretModalVisible = !responseSecretModalVisible
                    "
                  >
                    选择密钥
                  </a-button>
                </a-form-item>
              </a-col>
              <a-col
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.responseSecretId
                "
                :span="12"
              >
                <a-form-item label="密钥名称" field="secretName">
                  <a-input
                    v-model="responseSecretFormData.secretName"
                    disabled
                  />
                  <a-button
                    type="text"
                    @click="
                      () => (responseSecretShowMore = !responseSecretShowMore)
                    "
                    >{{
                      responseSecretShowMore ? '收起' : '查看详细信息'
                    }}</a-button
                  >
                </a-form-item>
              </a-col>
            </a-row>
            <div v-show="responseSecretShowMore">
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.responseSecretId
                "
              >
                <a-col :span="12">
                  <a-form-item label="编码类型" field="encodingType">
                    <a-select
                      v-model="responseSecretFormData.encodingType"
                      disabled
                    >
                      <a-option value="1">Hex16</a-option>
                      <a-option value="2">Base64</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="密钥类型" field="secretType">
                    <a-select
                      v-model="responseSecretFormData.secretType"
                      disabled
                      allow-clear
                    >
                      <a-option value="1">对称密钥</a-option>
                      <a-option value="2">非对称密钥</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.responseSecretId &&
                  responseSecretFormData.secretType === '1'
                "
              >
                <a-form-item
                  label="密钥"
                  field="secretKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="responseSecretFormData.secretKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.responseSecretId &&
                  responseSecretFormData.secretType === '2'
                "
              >
                <a-form-item
                  label="公钥"
                  field="publicKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="responseSecretFormData.publicKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
              <a-row
                v-if="
                  applicationFormData.cryptorEnable === '1' &&
                  applicationFormData.responseSecretId &&
                  responseSecretFormData.secretType === '2'
                "
              >
                <a-form-item
                  label="私钥"
                  field="privateKey"
                  :label-col-props="{ span: 3 }"
                  :wrapper-col-props="{ span: 21 }"
                >
                  <a-textarea
                    v-model="responseSecretFormData.privateKey"
                    disabled
                    :max-length="256"
                    show-word-limit
                  />
                </a-form-item>
              </a-row>
            </div>
          </div>
        </a-card>
      </a-space>
      <div v-if="!readonly" class="actions">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit">
            提交
          </a-button>
          <a-button> 重置 </a-button>
        </a-space>
      </div>
    </a-form>
    <a-modal
      v-model:visible="enterpriseModalVisible"
      title="企业信息"
      unmount-on-close
      width="auto"
      :body-style="{ padding: 0, minWidth: '1080px' }"
      @ok="enterpriseModalOk"
      @cancel="modalCancel"
    >
      <EnterpriseList ref="enterpriseListRef" />
    </a-modal>
    <a-modal
      v-model:visible="requestSecretModalVisible"
      title="密钥信息"
      unmount-on-close
      width="auto"
      :body-style="{ padding: 0, minWidth: '1080px' }"
      @ok="requestSecretModalOk"
      @cancel="modalCancel"
    >
      <SecretList ref="requestSecretListRef" />
    </a-modal>
    <a-modal
      v-model:visible="responseSecretModalVisible"
      title="密钥信息"
      unmount-on-close
      width="auto"
      :body-style="{ padding: 0, minWidth: '1080px' }"
      @ok="responseSecretModalOk"
      @cancel="modalCancel"
    >
      <SecretList ref="responseSecretListRef" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    ApplicationRecord,
    createApplication,
    queryApplicationDetail,
    updateApplication,
  } from '@/api/biz/application';
  import EnterpriseList from '@/views/enterprise/components/list/index.vue';
  import {
    EnterpriseRecord,
    queryEnterpriseDetail,
  } from '@/api/biz/enterprise';
  import { querySecretDetail, SecretRecord } from '@/api/biz/secret';
  import SecretList from '@/views/system/secret/components/list/index.vue';

  const router = useRouter();
  const route = useRoute();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const applicationFormData = ref<ApplicationRecord>({} as ApplicationRecord);
  const enterpriseFormData = ref<EnterpriseRecord>({} as EnterpriseRecord);
  const requestSecretFormData = ref<SecretRecord>({} as SecretRecord);
  const responseSecretFormData = ref<SecretRecord>({} as SecretRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const enterpriseModalVisible = ref(false);
  const secretModalVisible = ref(false);
  const requestSecretModalVisible = ref(false);
  const responseSecretModalVisible = ref(false);
  const requestSecretShowMore = ref(false);
  const responseSecretShowMore = ref(false);
  const enterpriseListRef = ref({
    selectedKeysHandler: () => [],
  });
  const requestSecretListRef = ref({
    selectedKeysHandler: () => [],
  });
  const responseSecretListRef = ref({
    selectedKeysHandler: () => [],
  });
  const submitSuccess = async () => {
    setLoading(true);
    try {
      if (action.value === '0') {
        const { msg } = await createApplication(applicationFormData.value);
        await router.push({
          name: 'ApplicationList',
        });
        Message.info(msg);
      } else if (action.value === '2') {
        const { appId } = route.params;
        applicationFormData.value.appId = appId as string;
        const { msg } = await updateApplication(applicationFormData.value);
        await router.push({
          name: 'ApplicationList',
        });
        Message.info(msg);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const modalCancel = () => {
    enterpriseModalVisible.value = false;
    secretModalVisible.value = false;
  };

  const queryEnterprise = async (enterpriseId: string) => {
    if (enterpriseId) {
      const { data } = await queryEnterpriseDetail({
        enterpriseId,
      } as EnterpriseRecord);
      enterpriseFormData.value = data;
    }
  };

  const queryRequestSecret = async (secretId: string) => {
    if (secretId) {
      const { data } = await querySecretDetail({
        secretId,
      } as SecretRecord);
      requestSecretFormData.value = data;
    }
  };

  const queryResponseSecret = async (secretId: string) => {
    if (secretId) {
      const { data } = await querySecretDetail({
        secretId,
      } as SecretRecord);
      responseSecretFormData.value = data;
    }
  };
  const enterpriseModalOk = () => {
    const keys = enterpriseListRef.value.selectedKeysHandler();
    const enterpriseId = keys[0] as string;
    queryEnterprise(enterpriseId);
    applicationFormData.value.enterpriseId = enterpriseId;
    modalCancel();
  };

  const requestSecretModalOk = () => {
    const keys = requestSecretListRef.value.selectedKeysHandler();
    const secretId = keys[0] as string;
    queryRequestSecret(secretId);
    applicationFormData.value.requestSecretId = secretId;
    modalCancel();
  };

  const responseSecretModalOk = () => {
    const keys = responseSecretListRef.value.selectedKeysHandler();
    const secretId = keys[0] as string;
    queryResponseSecret(secretId);
    applicationFormData.value.responseSecretId = secretId;
    modalCancel();
  };

  const init = async () => {
    const { appId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const { data } = await queryApplicationDetail({
          appId,
        } as ApplicationRecord);
        applicationFormData.value = data;
        await queryEnterprise(data.enterpriseId);
        if (data && data.requestSecretId) {
          await queryRequestSecret(data.requestSecretId);
        }
        if (data && data.responseSecretId) {
          await queryResponseSecret(data.responseSecretId);
        }
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
