import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

interface FeatureFlag {
  id: number;
  name: string;
  enabled: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface SystemSetting {
  id: number;
  name: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const DevelopmentMode = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [devMode, setDevMode] = useState(false);
  
  // Fetch feature flags
  const { data: features, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['/api/features'],
    staleTime: 5000,
  });

  // Fetch system settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/settings'],
    staleTime: 5000,
  });

  // Toggle development mode
  const { mutate: updateSetting } = useMutation({
    mutationFn: async (data: { name: string; value: string }) => {
      return apiRequest('/api/settings/update', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Cài đặt đã được cập nhật",
        description: "Các cài đặt hệ thống đã được lưu thành công."
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật cài đặt: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Toggle feature flag
  const { mutate: updateFeature } = useMutation({
    mutationFn: async (data: { name: string; enabled: boolean }) => {
      return apiRequest('/api/features/update', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/features'] });
      toast({
        title: "Tính năng đã được cập nhật",
        description: "Trạng thái tính năng đã được lưu thành công."
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật tính năng: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Enable all features
  const { mutate: enableAllFeatures, isPending: isEnablingAll } = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/features/enable-all', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/features'] });
      toast({
        title: "Tất cả tính năng đã được bật",
        description: "Đã bật tất cả tính năng thành công."
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: `Không thể bật tất cả tính năng: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Load initial dev mode status
  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const devModeSetting = settings.find((s: SystemSetting) => s.name === 'development_mode');
      if (devModeSetting) {
        setDevMode(devModeSetting.value === 'true');
      }
    }
  }, [settings]);

  // Handle dev mode toggle
  const handleDevModeToggle = (checked: boolean) => {
    setDevMode(checked);
    updateSetting({ name: 'development_mode', value: checked ? 'true' : 'false' });
    updateSetting({ name: 'display_all_features', value: checked ? 'true' : 'false' });
    updateSetting({ name: 'show_experimental', value: checked ? 'true' : 'false' });
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureName: string, enabled: boolean) => {
    updateFeature({ name: featureName, enabled });
  };

  // Feature descriptions for UI display
  const featureDescriptions: Record<string, string> = {
    risk_assessment: "Phân tích và đánh giá rủi ro của các hệ thống AI",
    system_registration: "Đăng ký và quản lý thông tin hệ thống AI",
    training_modules: "Các mô-đun đào tạo về tuân thủ EU AI Act",
    expert_reviews: "Đánh giá chuyên gia về hệ thống và tài liệu",
    knowledge_center: "Trung tâm kiến thức và tài liệu tham khảo",
    regulatory_updates: "Cập nhật quy định và tin tức pháp lý",
    document_templates: "Mẫu tài liệu và báo cáo tuân thủ",
    ai_autofill: "Tự động điền thông tin bằng AI",
    multilingual_support: "Hỗ trợ đa ngôn ngữ trên nền tảng",
    interactive_scenarios: "Kịch bản tương tác và tình huống thực tế",
    enterprise_dashboard: "Bảng điều khiển doanh nghiệp nâng cao",
    strategic_planning: "Công cụ lập kế hoạch chiến lược",
    literacy_modules: "Mô-đun nâng cao kiến thức về AI"
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Chế Độ Phát Triển</h1>
      <p className="text-muted-foreground mb-8">
        Trang này cho phép bạn bật/tắt chế độ phát triển và quản lý các tính năng hệ thống.
      </p>

      <div className="grid gap-6">
        {/* Dev Mode Toggle Card */}
        <Card>
          <CardHeader>
            <CardTitle>Chế Độ Phát Triển</CardTitle>
            <CardDescription>
              Bật chế độ phát triển để hiển thị tất cả tính năng và nội dung đang phát triển
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="dev-mode"
                checked={devMode}
                onCheckedChange={handleDevModeToggle}
              />
              <Label htmlFor="dev-mode">
                {devMode ? "Đã bật" : "Đã tắt"}
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Khi bật, tất cả các tính năng đang phát triển sẽ được hiển thị trong giao diện người dùng
            </p>
          </CardFooter>
        </Card>

        {/* Feature Flags Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tính Năng Hệ Thống</CardTitle>
                <CardDescription>
                  Quản lý các tính năng có sẵn trong hệ thống
                </CardDescription>
              </div>
              <Button 
                onClick={() => enableAllFeatures()} 
                disabled={isEnablingAll}
              >
                {isEnablingAll ? <Spinner className="mr-2" /> : null}
                Bật Tất Cả
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingFeatures ? (
              <div className="flex justify-center py-6">
                <Spinner size="lg" />
              </div>
            ) : features && Array.isArray(features) && features.length > 0 ? (
              <div className="space-y-4">
                {features.map((feature: FeatureFlag) => (
                  <div key={feature.id} className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <Label htmlFor={`feature-${feature.id}`} className="font-medium">
                        {feature.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {featureDescriptions[feature.name] || "Tính năng hệ thống"}
                      </p>
                    </div>
                    <Switch
                      id={`feature-${feature.id}`}
                      checked={feature.enabled}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.name, checked)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Không có tính năng nào được định nghĩa
              </p>
            )}
          </CardContent>
        </Card>

        {/* System Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cài Đặt Hệ Thống</CardTitle>
            <CardDescription>
              Xem và quản lý các cài đặt hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSettings ? (
              <div className="flex justify-center py-6">
                <Spinner size="lg" />
              </div>
            ) : settings && Array.isArray(settings) && settings.length > 0 ? (
              <div className="space-y-4">
                {settings.map((setting: SystemSetting) => (
                  <div key={setting.id} className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <Label className="font-medium">
                        {setting.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.description || "Cài đặt hệ thống"}
                      </p>
                    </div>
                    <div className="bg-muted px-3 py-1 rounded text-sm">
                      {setting.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Không có cài đặt nào được định nghĩa
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentMode;