<template>
  <div class="container">
    <a-card class="general-card" title="查询表格">
      <a-form
        :model="formModel"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="right"
      >
        <a-grid :cols="3" :collapsed="!moreSearch">
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item>
            <a-form-item field="routeName" label="路由名称">
              <a-input v-model="formModel.routeName" />
            </a-form-item>
          </a-grid-item>
          <a-grid-item suffix #="{ overflow }">
            <a-form-item>
              <a-space direction="horizontal">
                <a-button type="primary" @click="search"> 查询 </a-button>
                <a-button @click="reset"> 重置 </a-button>
                <a-button type="text" @click="moreSearch = !moreSearch">
                  <template #icon>
                    <icon-double-up v-if="moreSearch" />
                    <icon-double-down v-else />
                  </template>
                  {{ moreSearch ? '收起' : '更多' }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="
                router.push({
                  name: 'ApplicationCreate',
                  query: {
                    actionType: '0',
                  },
                })
              "
            >
              <template #icon>
                <icon-plus />
              </template>
              创建
            </a-button>
            <a-upload action="/">
              <template #upload-button>
                <a-button> 批量导入 </a-button>
              </template>
            </a-upload>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            下载
          </a-button>
          <a-tooltip content="刷新">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip content="密度">
              <div class="action-icon">
                <icon-line-height size="18" />
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip content="列设置">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon">
                <icon-settings size="18" />
              </div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item, index)"
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #status="{ record }">
          <span v-if="record.status === '0'" class="circle reject"></span>
          <span v-else class="circle pass"></span>
          {{ record.status === '0' ? '已下线' : '已上线' }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
              v-permission="['admin']"
              size="small"
              @click="
                router.push({
                  name: 'ApplicationDetail',
                  params: {
                    appId: record.appId,
                  },
                  query: {
                    actionType: '1',
                  },
                })
              "
            >
              查看
            </a-button>
            <a-button
              v-permission="['admin']"
              size="small"
              @click="
                router.push({
                  name: 'ApplicationDetail',
                  params: {
                    appId: record.appId,
                  },
                  query: {
                    actionType: '2',
                  },
                })
              "
            >
              编辑
            </a-button>
            <a-button
              v-permission="['admin']"
              size="small"
              @click="deleteRoute(record.appId)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive, ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    ApplicationParams,
    ApplicationRecord,
    deleteByAppId,
    queryApplicationList,
  } from '@/api/biz/application';

  const router = useRouter();
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<ApplicationRecord[]>([]);
  const formModel = ref<ApplicationRecord>({} as ApplicationRecord);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const moreSearch = ref<boolean>(false);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: '迷你',
      value: 'mini',
    },
    {
      name: '偏小',
      value: 'small',
    },
    {
      name: '中等',
      value: 'medium',
    },
    {
      name: '偏大',
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '应用编号',
      dataIndex: 'appId',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用key',
      dataIndex: 'appKey',
    },
    {
      title: '应用secret',
      dataIndex: 'appSecret',
    },
    {
      title: '企业编号',
      dataIndex: 'enterpriseId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
      slotName: 'operations',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: '已上线',
      value: '1',
    },
    {
      label: '已下线',
      value: '0',
    },
  ]);
  const fetchData = async (
    params: ApplicationParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryApplicationList(params);
      renderData.value = data.records;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as ApplicationParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = {} as ApplicationRecord;
  };

  const deleteRoute = async (appId: string) => {
    Modal.confirm({
      title: `确认删除 ？`,
      content: '',
      onOk: async () => {
        const params = {
          appId,
        } as ApplicationRecord;
        const { msg } = await deleteByAppId(params);
        Message.info(msg);
        await fetchData();
      },
    });
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
