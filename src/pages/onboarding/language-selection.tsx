import {useContext, useState} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {FormattedMessage, useIntl} from "react-intl";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm, Controller} from "react-hook-form";
import OnboardingProgress from "@/pages/onboarding/components/progress.tsx";
import {InputField} from "@/components/application/inputs/input-field.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {getFlagEmoji} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import api from "@/lib/api.ts";
import {OnboardingStepProps} from "@/pages/onboarding/index.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Edit, Plus} from "lucide-react";

const AVAILABLE_UI_LOCALES = ['de', 'en', 'es', 'fr', 'it', 'nl', 'pt', 'ro'];

// Reusable component for language badges
function LanguageBadges({
                            locales,
                            selectedLanguages,
                            excludeLocale,
                            onToggle,
                            maxSelection,
                            showOnlySelected = false,
                        }: {
    locales: Record<string, any>;
    selectedLanguages: string[];
    excludeLocale?: string;
    onToggle?: (locale: string) => void;
    maxSelection?: number;
    showOnlySelected?: boolean;
}) {
    const languages = Object.entries(locales).filter(([locale]) => {
        if (locale === excludeLocale) return false;
        if (showOnlySelected) return selectedLanguages.includes(locale);
        return true;
    });

    if (languages.length === 0) return null;

    return (
        <>
            {languages.map(([value, locale]) => {
                const isSelected = selectedLanguages.includes(value);
                const isDisabled = !isSelected && maxSelection !== undefined && selectedLanguages.length >= maxSelection;
                const isClickable = onToggle && !isDisabled;

                return (
                    <Badge
                        key={value}
                        variant={isSelected ? "secondary" : "outline"}
                        className={`gap-3 px-3 h-12 ${
                            isSelected ? "border-2 border-primary" : ""
                        } ${
                            isDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : isClickable ? "cursor-pointer hover:bg-accent" : ""
                        }`}
                        onClick={() => isClickable && onToggle(value)}
                        role={isClickable ? "button" : undefined}
                        tabIndex={isClickable ? (isDisabled ? -1 : 0) : undefined}
                        aria-disabled={isDisabled}
                        onKeyDown={(e) => {
                            if (isClickable && !isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                onToggle(value);
                            }
                        }}
                    >
                        <span className={'text-lg'}>{getFlagEmoji(locale.iso)}</span>
                        <span>{locale.native}</span>
                    </Badge>
                );
            })}
        </>
    );
}

interface LanguageFormData {
    uiLanguage: string;
    defaultLanguage: string;
    secondaryLanguages: string[];
}

export default function OnboardingLanguageSelection(props: OnboardingStepProps) {
    const {locales, languages, tenant, ui_locale} = useContext(AppContext);
    const intl = useIntl();
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);

    // React Hook Form setup
    const {control, handleSubmit, watch, setValue} = useForm<LanguageFormData>({
        defaultValues: {
            uiLanguage: ui_locale || 'en',
            defaultLanguage: tenant.default_language?.locale || 'en',
            secondaryLanguages: languages
                .filter((l) => l.id != tenant.default_language?.id)
                .map((l) => l.locale),
        },
    });

    const secondaryLanguages = watch("secondaryLanguages");
    const defaultLanguage = watch("defaultLanguage");

    // Mutation for saving language settings
    const saveLanguageSettings = useMutation({
        mutationFn: async (data: LanguageFormData) => {
            // TODO: Replace with actual API call
            await api.profileSettings.update({
                ui_locale: data.uiLanguage,
            });

            await api.language.activate({
                // @ts-ignore
                locales: secondaryLanguages,
                // @ts-ignore
                default_locale: defaultLanguage,
            });

            await queryClient.refetchQueries({
                queryKey: ['settings']
            })
        },
        onSuccess: () => {
            props.onSave();
        },
        onError: (error) => {
            console.error('Failed to save language settings:', error);
        },
    });

    const handleToggleSecondaryLanguage = (locale: string) => {
        const isSelected = secondaryLanguages.includes(locale);
        if (isSelected) {
            setValue("secondaryLanguages", secondaryLanguages.filter(lang => lang !== locale));
        } else if (secondaryLanguages.length < 5) {
            setValue("secondaryLanguages", [...secondaryLanguages, locale]);
        }
    };

    const onSubmit = (data: LanguageFormData) => {
        saveLanguageSettings.mutate(data);
    };

    return <>
        <h1 className={"text-xl flex-1 font-medium text-balance"}>
            <FormattedMessage
                defaultMessage="Welcome aboard! Let's set things up"
                description="Onboarding page title"
            />
        </h1>
        <p className="text-muted-foreground">
            <FormattedMessage
                defaultMessage="First up: choosing your UI and content languages."
                description="Onboarding page description"
            />
        </p>

        <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className={'my-8'}/>

        {/* Language Selection Form */}
        <div className="w-full space-y-6">
            <Controller
                name="uiLanguage"
                control={control}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Dashboard Language"
                                description="Label for UI language selector"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="This is the language used for all menus, buttons, and interface elements."
                                description="Description for UI language field"
                            />
                        }
                    >
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full max-w-sm">
                                <SelectValue
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "Select UI language",
                                        description: "Placeholder for UI language selector"
                                    })}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABLE_UI_LOCALES.map((locale) => {
                                    const localeData = locales[locale];
                                    return (
                                        <SelectItem key={locale} value={locale}>
                                            <span className="flex items-center gap-2">
                                                <span>{getFlagEmoji(localeData.iso)}</span>
                                                <span>{localeData.native as string}</span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </InputField>
                )}
            />

            <Separator orientation={'horizontal'} className={'my-10'}/>

            {/* Default Language Select */}
            <Controller
                name="defaultLanguage"
                control={control}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Primary Content Language"
                                description="Label for primary language selector"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="This is the language you must use when adding content. You can optionally add translations in other languages."
                                description="Description for default language field"
                            />
                        }
                    >
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full max-w-sm">
                                <SelectValue
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "Select default language",
                                        description: "Placeholder for default language selector"
                                    })}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(locales).map(([locale, name]) => (
                                    <SelectItem key={locale} value={locale}>
                                                <span className="flex items-center gap-2">
                                                    <span>{getFlagEmoji(name.iso)}</span>
                                                    <span>{name.native as string}</span>
                                                </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </InputField>
                )}
            />

            {/* Secondary Languages */}
            <InputField
                optional
                label={
                    <FormattedMessage
                        defaultMessage="Additional Languages"
                        description="Label for secondary languages selector"
                    />
                }
            >
                <div
                    className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 min-h-[100px] mt-1 flex flex-wrap items-center gap-2 hover:border-muted-foreground/40 transition-colors cursor-pointer"
                    onClick={() => secondaryLanguages.length === 0 && setDialogOpen(true)}
                    role={secondaryLanguages.length === 0 ? "button" : undefined}
                    tabIndex={secondaryLanguages.length === 0 ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (secondaryLanguages.length === 0 && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            setDialogOpen(true);
                        }
                    }}
                >
                    {secondaryLanguages.length === 0 ? (
                        /* Empty state - centered ghost button */
                        <div className="w-full flex items-center justify-center py-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(true)}
                            >
                                <Plus/>
                                <FormattedMessage
                                    defaultMessage="Select additional languages"
                                    description="Button to open language selection dialog when empty"
                                />
                            </Button>
                        </div>
                    ) : (
                        /* Display selected languages with action badge */
                        <div className="flex flex-wrap gap-2" onClick={() => setDialogOpen(true)}>
                            <LanguageBadges
                                locales={locales}
                                selectedLanguages={secondaryLanguages}
                                excludeLocale={defaultLanguage}
                                showOnlySelected={true}
                            />
                            <Button
                                variant="ghost"
                                className="gap-2 h-12 px-6 cursor-pointer hover:bg-accent border-primary/50 hover:border-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDialogOpen(true);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDialogOpen(true);
                                    }
                                }}
                            >
                                <Edit/>
                                <span>
                                    <FormattedMessage
                                        defaultMessage="Edit"
                                        description="Button to edit language selection"
                                    />
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </InputField>

            {/* Dialog for language selection */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent size="lg">
                    <DialogHeader>
                        <DialogTitle>
                            <FormattedMessage
                                defaultMessage="Select Additional Languages"
                                description="Dialog title for language selection"
                            />
                        </DialogTitle>
                        <DialogDescription>
                            <FormattedMessage
                                defaultMessage="Choose up to 5 additional languages for your content. Click on a language to select or deselect it."
                                description="Dialog description for language selection"
                            />
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="flex flex-wrap gap-2">
                            <LanguageBadges
                                locales={locales}
                                selectedLanguages={secondaryLanguages}
                                excludeLocale={defaultLanguage}
                                onToggle={handleToggleSecondaryLanguage}
                                maxSelection={5}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {secondaryLanguages.length >= 5 ? (
                                <FormattedMessage
                                    defaultMessage="Maximum of 5 additional languages reached"
                                    description="Message when max secondary languages selected"
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="{count} {count, plural, one {language} other {languages}} selected"
                                    description="Count of selected languages"
                                    values={{count: secondaryLanguages.length}}
                                />
                            )}
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            <FormattedMessage
                                defaultMessage="Done"
                                description="Button to close language selection dialog"
                            />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
                <div>&nbsp;</div>
                <Button
                    className="flex-1"
                    disabled={saveLanguageSettings.isPending}
                    onClick={handleSubmit(onSubmit)}
                >
                    <FormattedMessage
                        defaultMessage="Continue"
                        description="Continue button label"
                    />
                </Button>
            </div>
        </div>
    </>;
}